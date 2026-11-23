#!/usr/bin/env node
/**
 * tactile-ui: Zero-dependency static audit script for UI stylesheets and components.
 *
 * Usage:
 *   node scripts/audit-ui.mjs [--changed] [--json] [--strict] [file-or-dir ...]
 *
 * Rules:
 *   - layout-animation           (error / warning on `transition: all`)
 *   - missing-reduced-motion     (error)
 *   - motion-velocity-ignored    (error)
 *   - scale-zero-entrance        (error)
 *   - unguarded-bleeding-edge-css (warning, fails with --strict)
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SUPPORTED_EXTS = new Set([".css", ".scss", ".jsx", ".tsx", ".ts", ".js", ".html"]);
const CSS_EXTS = new Set([".css", ".scss"]);
const SCRIPT_EXTS = new Set([".jsx", ".tsx", ".ts", ".js"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage"]);

const LAYOUT_PROPS = new Set([
  "top",
  "left",
  "right",
  "bottom",
  "width",
  "height",
  "min-width",
  "max-width",
  "min-height",
  "max-height",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "margin-inline",
  "margin-inline-start",
  "margin-inline-end",
  "margin-block",
  "margin-block-start",
  "margin-block-end",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "padding-inline",
  "padding-inline-start",
  "padding-inline-end",
  "padding-block",
  "padding-block-start",
  "padding-block-end",
]);

const LAYOUT_JS_PROPS = new Set([
  "top",
  "left",
  "right",
  "bottom",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginInline",
  "marginBlock",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingInline",
  "paddingBlock",
]);

function printUsage() {
  console.error(
    "Usage: node scripts/audit-ui.mjs [--changed] [--json] [--strict] [file-or-dir ...]"
  );
}

const rawArgs = process.argv.slice(2);
const changedOnly = rawArgs.includes("--changed");
const jsonMode = rawArgs.includes("--json");
const strictMode = rawArgs.includes("--strict");
const positional = rawArgs.filter((a) => !a.startsWith("-"));

if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
  printUsage();
  process.exit(0);
}

if (!changedOnly && positional.length === 0) {
  printUsage();
  process.exit(2);
}

function collectFilesFromDir(dirPath, out) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectFilesFromDir(full, out);
    } else if (entry.isFile() && SUPPORTED_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
}

function getChangedFiles(cwd) {
  const res = spawnSync("git", ["status", "--porcelain"], {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  if (res.status !== 0) {
    console.error("Failed to list changed files via `git status --porcelain`. Pass explicit paths instead.");
    process.exit(2);
  }
  const files = [];
  for (const line of res.stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const statusCode = line.slice(0, 2);
    if (statusCode.includes("D")) continue;
    let rel = line.slice(3).trim();
    if (rel.includes(" -> ")) {
      rel = rel.split(" -> ").pop().trim();
    }
    rel = rel.replace(/^"|"$/g, "");
    const abs = path.resolve(cwd, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile() && SUPPORTED_EXTS.has(path.extname(abs).toLowerCase())) {
      files.push(abs);
    }
  }
  return files;
}

const targetSet = new Set();
const cwd = process.cwd();

if (changedOnly) {
  for (const f of getChangedFiles(cwd)) {
    targetSet.add(path.resolve(f));
  }
}

for (const p of positional) {
  const abs = path.resolve(cwd, p);
  if (!fs.existsSync(abs)) {
    console.error(`Path not found: ${p}`);
    process.exit(2);
  }
  const st = fs.statSync(abs);
  if (st.isDirectory()) {
    const collected = [];
    collectFilesFromDir(abs, collected);
    for (const f of collected) targetSet.add(path.resolve(f));
  } else if (st.isFile()) {
    if (SUPPORTED_EXTS.has(path.extname(abs).toLowerCase())) {
      targetSet.add(abs);
    }
  }
}

const filesToScan = [...targetSet].sort();

/**
 * Strip comments while preserving exact string literals and line breaks so line numbers stay 1:1.
 */
function stripCommentsPreserveLines(src, kind) {
  let out = "";
  let i = 0;
  let quote = null;

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (quote) {
      out += ch;
      if (ch === "\\" && i + 1 < src.length) {
        out += src[i + 1];
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      i++;
      continue;
    }

    if (kind === "html" && src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      const stop = end === -1 ? src.length : end + 3;
      for (let k = i; k < stop; k++) {
        out += src[k] === "\n" ? "\n" : " ";
      }
      i = stop;
      continue;
    }

    if (ch === "/" && next === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      for (let k = i; k < stop; k++) {
        out += src[k] === "\n" ? "\n" : " ";
      }
      i = stop;
      continue;
    }

    if (kind === "script" && ch === "/" && next === "/") {
      const end = src.indexOf("\n", i + 2);
      const stop = end === -1 ? src.length : end;
      for (let k = i; k < stop; k++) {
        out += " ";
      }
      i = stop;
      continue;
    }

    if (ch === "'" || ch === '"' || (kind === "script" && ch === "`")) {
      quote = ch;
      out += ch;
      i++;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

function indexToLine(text, idx) {
  let line = 1;
  for (let i = 0; i < idx && i < text.length; i++) {
    if (text[i] === "\n") line++;
  }
  return line;
}

function getSuppressionMap(rawText) {
  const map = new Map();
  const lines = rawText.split(/\r?\n/);
  for (let idx = 0; idx < lines.length; idx++) {
    const m = lines[idx].match(/tactile-ui-ignore(?:\s*:\s*([a-z0-9-,\s]+))?/i);
    if (!m) continue;
    const rules = m[1]
      ? new Set(
          m[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      : "all";
    map.set(idx + 1, rules);
  }
  return map;
}

function isSuppressed(suppressionMap, line, rule) {
  for (const checkLine of [line, line - 1]) {
    const entry = suppressionMap.get(checkLine);
    if (!entry) continue;
    if (entry === "all" || entry.has(rule)) return true;
  }
  return false;
}

function makeRecorder(filePath, rawLines, suppressionMap, findings) {
  const relPath = path.relative(cwd, filePath) || path.basename(filePath);
  const seen = new Set();
  return function record(line, severity, rule, message) {
    if (isSuppressed(suppressionMap, line, rule)) return;
    const key = `${relPath}:${line}:${rule}:${message}`;
    if (seen.has(key)) return;
    seen.add(key);
    const snippet = (rawLines[line - 1] || "").trim().slice(0, 140);
    findings.push({
      file: relPath,
      line,
      severity,
      rule,
      message,
      snippet,
    });
  };
}

/**
 * Audit CSS / SCSS content (used directly for .css/.scss and for <style> blocks in .html).
 */
function auditCssContent(strippedCss, lineOffset, record) {
  // Check scale(0) and standalone `scale: 0` across CSS
  const scaleFuncRegex = /\b(?:scale|scale3d)\(\s*0(?:\.0+)?\s*(?:,\s*0(?:\.0+)?\s*){0,2}\)/gi;
  for (const m of strippedCss.matchAll(scaleFuncRegex)) {
    const line = lineOffset + indexToLine(strippedCss, m.index) - 1;
    record(line, "error", "scale-zero-entrance", `Avoid ${m[0]} entrance states; start at scale(0.97) + opacity: 0.`);
  }

  const scalePropRegex = /(?:^|[;{\s])scale\s*:\s*0(?:\.0+)?(?=\s*[;}\r\n]|$)/gim;
  for (const m of strippedCss.matchAll(scalePropRegex)) {
    const propIdx = m.index + m[0].search(/scale/i);
    const line = lineOffset + indexToLine(strippedCss, propIdx) - 1;
    record(line, "error", "scale-zero-entrance", "Avoid `scale: 0` entrance states; start at `scale: 0.97` + `opacity: 0`.");
  }

  // Check @media (prefers-reduced-motion: reduce) requirement
  const hasAnimation =
    /@keyframes\s+[A-Za-z0-9_-]+/i.test(strippedCss) ||
    /\banimation(?:-name)?\s*:(?!\s*(?:none|initial|inherit|unset)\b)/i.test(strippedCss) ||
    /\btransition(?:-property)?\s*:(?!\s*(?:none|initial|inherit|unset)\b)/i.test(strippedCss);

  if (hasAnimation && !/@media\b[^{]*prefers-reduced-motion\s*:\s*reduce/i.test(strippedCss)) {
    record(
      lineOffset,
      "error",
      "missing-reduced-motion",
      "File defines CSS animations or transitions without a `@media (prefers-reduced-motion: reduce)` rule."
    );
  }

  // Walk CSS brace scopes to inspect @keyframes, @supports, and fallback declarations cleanly
  const scopeStack = [];
  let tokenStart = 0;

  function flushDeclaration(declRaw, declAbsStart, currentBlockProps) {
    const decl = declRaw.trim();
    if (!decl || decl.startsWith("@")) return;
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) return;

    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const val = decl.slice(colonIdx + 1).trim();
    const valLower = val.toLowerCase();
    const line = lineOffset + indexToLine(strippedCss, declAbsStart) - 1;

    const inKeyframes = scopeStack.some((s) => s.type === "keyframes");
    const inSupports = scopeStack.some((s) => s.type === "supports");

    if (inKeyframes && LAYOUT_PROPS.has(prop)) {
      record(
        line,
        "error",
        "layout-animation",
        `\`@keyframes\` animates layout property \`${prop}\`. Animate \`transform\` or \`opacity\` instead.`
      );
    }

    if ((prop === "transition" || prop === "transition-property") && valLower !== "none") {
      const segments = valLower.split(",");
      for (const seg of segments) {
        const firstToken = seg.trim().split(/\s+/)[0];
        if (!firstToken) continue;
        if (firstToken === "all") {
          record(
            line,
            "warning",
            "layout-animation",
            "`transition: all` can trigger layout transitions unintentionally. Scope to `transform, opacity`."
          );
        } else if (LAYOUT_PROPS.has(firstToken)) {
          record(
            line,
            "error",
            "layout-animation",
            `\`${prop}\` animates layout property \`${firstToken}\`. Animate \`transform\` or \`opacity\` instead.`
          );
        }
      }
    }

    if (!inSupports) {
      if (prop === "text-box-trim") {
        record(
          line,
          "warning",
          "unguarded-bleeding-edge-css",
          "Wrap `text-box-trim` in `@supports (text-box-trim: trim-both)` for cross-browser safety."
        );
      } else if (prop === "interpolate-size") {
        record(
          line,
          "warning",
          "unguarded-bleeding-edge-css",
          "Wrap `interpolate-size` in `@supports (interpolate-size: allow-keywords)` with a fallback."
        );
      } else if (/\boklch\(/i.test(valLower) || /\bin\s+oklch\b/i.test(valLower)) {
        const hasFallback = currentBlockProps.get(prop) === true;
        if (!hasFallback) {
          record(
            line,
            "warning",
            "unguarded-bleeding-edge-css",
            `\`${prop}\` uses \`oklch\` without a prior fallback declaration or \`@supports\` wrapper.`
          );
        }
      }
    }

    // Track whether this property has a safe non-oklch declaration before later overrides in the same block
    if (!/\boklch\(/i.test(valLower) && !/\bin\s+oklch\b/i.test(valLower)) {
      currentBlockProps.set(prop, true);
    }
  }

  let currentBlockProps = new Map();
  let bracePropsStack = [currentBlockProps];

  for (let i = 0; i < strippedCss.length; i++) {
    const ch = strippedCss[i];
    if (ch === "{") {
      const header = strippedCss.slice(tokenStart, i).trim().toLowerCase();
      let type = "rule";
      if (header.startsWith("@keyframes") || header.startsWith("@-webkit-keyframes")) {
        type = "keyframes";
      } else if (header.startsWith("@supports")) {
        type = "supports";
      } else if (header.startsWith("@media")) {
        type = "media";
      }
      scopeStack.push({ type, header });
      currentBlockProps = new Map();
      bracePropsStack.push(currentBlockProps);
      tokenStart = i + 1;
    } else if (ch === ";") {
      const rawSeg = strippedCss.slice(tokenStart, i);
      const nonWsOffset = rawSeg.search(/\S/);
      if (nonWsOffset !== -1) {
        flushDeclaration(rawSeg, tokenStart + nonWsOffset, currentBlockProps);
      }
      tokenStart = i + 1;
    } else if (ch === "}") {
      const rawSeg = strippedCss.slice(tokenStart, i);
      const nonWsOffset = rawSeg.search(/\S/);
      if (nonWsOffset !== -1) {
        flushDeclaration(rawSeg, tokenStart + nonWsOffset, currentBlockProps);
      }
      scopeStack.pop();
      bracePropsStack.pop();
      currentBlockProps = bracePropsStack[bracePropsStack.length - 1] || new Map();
      tokenStart = i + 1;
    }
  }
}

/**
 * Extract balanced `{ ... }` objects from stripped JS/TS/JSX/TSX and collect top-level keys.
 */
function inspectScriptObjects(strippedCode, record) {
  const stack = [];

  for (let i = 0; i < strippedCode.length; i++) {
    const ch = strippedCode[i];
    if (ch === "{") {
      stack.push(i);
    } else if (ch === "}" && stack.length > 0) {
      const start = stack.pop();
      const body = strippedCode.slice(start + 1, i);
      const keys = extractTopLevelObjectKeys(body);
      if (keys.size === 0) continue;

      const hasVelocity = keys.has("velocity");
      const hasDuration = keys.has("duration") || keys.has("visualDuration") || keys.has("bounce");

      if (hasVelocity && hasDuration) {
        const line = indexToLine(strippedCode, start);
        record(
          line,
          "error",
          "motion-velocity-ignored",
          "Motion ignores initial `velocity` when combined with `duration`/`visualDuration`/`bounce`. Use physics parameters (`stiffness`, `damping`, `mass`, `velocity`) instead."
        );
      }
    }
  }
}

function extractTopLevelObjectKeys(body) {
  const keys = new Set();
  let depth = 0;
  let quote = null;
  let topLevelText = "";

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === "\\" && i + 1 < body.length) {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{" || ch === "[" || ch === "(") {
      depth++;
      topLevelText += " ";
      continue;
    }
    if (ch === "}" || ch === "]" || ch === ")") {
      depth = Math.max(0, depth - 1);
      topLevelText += " ";
      continue;
    }
    if (depth === 0) {
      topLevelText += ch;
    }
  }

  for (const seg of topLevelText.split(",")) {
    const trimmed = seg.trim();
    if (!trimmed) continue;
    const kvMatch = trimmed.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*:/);
    if (kvMatch) {
      keys.add(kvMatch[1]);
      continue;
    }
    const shorthandMatch = trimmed.match(/^([A-Za-z_$][A-Za-z0-9_$]*)$/);
    if (shorthandMatch) {
      keys.add(shorthandMatch[1]);
    }
  }

  return keys;
}

function auditScriptContent(strippedCode, record, globalContext) {
  // 1. Scale zero in JS objects or Tailwind classes
  const jsScaleZero = /(?:^|[{,\s])scale\s*:\s*0(?:\.0+)?(?=\s*[,}\r\n]|$)/gm;
  for (const m of strippedCode.matchAll(jsScaleZero)) {
    const keyIdx = m.index + m[0].search(/scale/);
    record(
      indexToLine(strippedCode, keyIdx),
      "error",
      "scale-zero-entrance",
      "Avoid `scale: 0` entrance states; start at `scale: 0.97` + `opacity: 0`."
    );
  }

  const twScaleZero = /\bclass(?:Name)?\s*=\s*["'`{][^"'`}]+["'`}]/g;
  for (const m of strippedCode.matchAll(twScaleZero)) {
    if (/(?:^|[\s"'`])scale-0(?:$|[\s"'`])/.test(m[0])) {
      record(
        indexToLine(strippedCode, m.index),
        "error",
        "scale-zero-entrance",
        "Avoid Tailwind `scale-0` entrance states; use `scale-[0.97]` + `opacity-0`."
      );
    }
  }

  // 2. Motion velocity + duration/bounce check
  inspectScriptObjects(strippedCode, record);

  // 3. Layout props in Motion animation props (`animate={{ ... }}`, `whileHover={{ ... }}`, etc.)
  const usesMotion =
    /<motion\.[A-Za-z0-9_]+/.test(strippedCode) ||
    /\bfrom\s+["'](?:framer-motion|motion(?:\/react)?)["']/.test(strippedCode) ||
    /\banimate\s*\(/.test(strippedCode);

  if (usesMotion) {
    const motionPropRegex = /\b(?:animate|whileHover|whileTap|whileInView|exit|initial)\s*=\s*\{\s*\{/g;
    for (const m of strippedCode.matchAll(motionPropRegex)) {
      const objStart = m.index + m[0].length - 1;
      let depth = 0;
      let objEnd = -1;
      for (let k = objStart; k < strippedCode.length; k++) {
        if (strippedCode[k] === "{") depth++;
        else if (strippedCode[k] === "}") {
          depth--;
          if (depth === 0) {
            objEnd = k;
            break;
          }
        }
      }
      if (objEnd !== -1) {
        const keys = extractTopLevelObjectKeys(strippedCode.slice(objStart + 1, objEnd));
        for (const k of keys) {
          if (LAYOUT_JS_PROPS.has(k)) {
            record(
              indexToLine(strippedCode, objStart),
              "error",
              "layout-animation",
              `Motion prop animates layout property \`${k}\`. Animate \`transform\` (\`x\`/\`y\`/\`scale\`) or \`opacity\` instead.`
            );
          }
        }
      }
    }
  }

  // 4. Reduced motion check for files driving Motion or React <ViewTransition>
  const usesViewTransition = /<ViewTransition\b/.test(strippedCode);
  if (usesMotion || usesViewTransition) {
    const handlesReduced =
      /\buseReducedMotion\b/.test(strippedCode) ||
      /prefers-reduced-motion/.test(strippedCode) ||
      /\breducedMotion\b/.test(strippedCode) ||
      globalContext.hasMotionConfigReduced ||
      (usesViewTransition && globalContext.hasCssReducedMotion);

    if (!handlesReduced) {
      const match = strippedCode.match(/<motion\.[A-Za-z0-9_]+|<ViewTransition\b|\banimate\s*\(/);
      const line = match ? indexToLine(strippedCode, match.index) : 1;
      record(
        line,
        "error",
        "missing-reduced-motion",
        "Component introduces Motion or `<ViewTransition>` animations without `useReducedMotion`, `<MotionConfig reducedMotion=\"user\">`, or a reduced-motion rule."
      );
    }
  }
}

// Pre-scan across files for global wrappers like <MotionConfig reducedMotion="user"> or global CSS reduced-motion rules
const fileContents = new Map();
const globalContext = {
  hasMotionConfigReduced: false,
  hasCssReducedMotion: false,
};

for (const filePath of filesToScan) {
  const raw = fs.readFileSync(filePath, "utf8");
  fileContents.set(filePath, raw);
  const ext = path.extname(filePath).toLowerCase();
  if (SCRIPT_EXTS.has(ext) && /<MotionConfig\b[^>]*reducedMotion\s*=\s*["']?(?:user|always)["']?/.test(raw)) {
    globalContext.hasMotionConfigReduced = true;
  }
  if ((CSS_EXTS.has(ext) || ext === ".html") && /@media\b[^{]*prefers-reduced-motion\s*:\s*reduce/i.test(raw)) {
    globalContext.hasCssReducedMotion = true;
  }
}

const findings = [];

for (const filePath of filesToScan) {
  const raw = fileContents.get(filePath);
  const rawLines = raw.split(/\r?\n/);
  const suppressionMap = getSuppressionMap(raw);
  const record = makeRecorder(filePath, rawLines, suppressionMap, findings);
  const ext = path.extname(filePath).toLowerCase();

  if (CSS_EXTS.has(ext)) {
    const stripped = stripCommentsPreserveLines(raw, "css");
    auditCssContent(stripped, 1, record);
  } else if (SCRIPT_EXTS.has(ext)) {
    const stripped = stripCommentsPreserveLines(raw, "script");
    auditScriptContent(stripped, record, globalContext);
  } else if (ext === ".html") {
    const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    for (const m of raw.matchAll(styleRegex)) {
      const styleOffset = indexToLine(raw, m.index + m[0].indexOf(">") + 1);
      const strippedStyle = stripCommentsPreserveLines(m[1], "css");
      auditCssContent(strippedStyle, styleOffset, record);
    }
    const strippedHtml = stripCommentsPreserveLines(raw, "html");
    const twScaleZero = /\bclass\s*=\s*["'][^"']+["']/gi;
    for (const m of strippedHtml.matchAll(twScaleZero)) {
      if (/(?:^|[\s"'])scale-0(?:$|[\s"'])/.test(m[0])) {
        record(
          indexToLine(strippedHtml, m.index),
          "error",
          "scale-zero-entrance",
          "Avoid Tailwind `scale-0` entrance states; use `scale-[0.97]` + `opacity-0`."
        );
      }
    }
  }
}

const errorCount = findings.filter((f) => f.severity === "error").length;
const warningCount = findings.filter((f) => f.severity === "warning").length;
const ok = errorCount === 0 && (!strictMode || warningCount === 0);

if (jsonMode) {
  console.log(
    JSON.stringify(
      {
        ok,
        scannedFiles: filesToScan.length,
        errorCount,
        warningCount,
        findings,
      },
      null,
      2
    )
  );
} else {
  if (filesToScan.length === 0) {
    console.log("tactile-ui audit: 0 matching UI files to scan.");
  } else if (findings.length === 0) {
    console.log(`tactile-ui audit PASS (${filesToScan.length} file${filesToScan.length === 1 ? "" : "s"} scanned, 0 errors, 0 warnings).`);
  } else {
    for (const f of findings) {
      const tag = f.severity === "error" ? "ERROR" : "WARN ";
      console.log(`[${tag}] ${f.file}:${f.line} (${f.rule}) — ${f.message}`);
      if (f.snippet) console.log(`        ${f.snippet}`);
    }
    console.log(
      `\ntactile-ui audit ${ok ? "PASS" : "FAIL"} (${filesToScan.length} file${filesToScan.length === 1 ? "" : "s"} scanned, ${errorCount} error${errorCount === 1 ? "" : "s"}, ${warningCount} warning${warningCount === 1 ? "" : "s"}).`
    );
  }
}

process.exit(ok ? 0 : 1);
