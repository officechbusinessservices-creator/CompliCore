#!/usr/bin/env tsx
/**
 * Antigravity Builder Agent
 *
 * Reads a task spec from tasks/specs/<task>.md, loads the referenced source files,
 * calls Claude to generate implementations, then creates a branch, commits the
 * changes, and opens a pull request.
 *
 * Usage:
 *   npm run agent:build -- --task stripe-integration
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/agents/builder.ts --task stripe-integration
 */

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "../..");

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function getTaskName(): string {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--task");
  if (idx === -1 || !args[idx + 1]) {
    console.error("Usage: npm run agent:build -- --task <task-name>");
    process.exit(1);
  }
  return args[idx + 1];
}

// ---------------------------------------------------------------------------
// Spec parsing helpers
// ---------------------------------------------------------------------------

function readSpec(taskName: string): string {
  const specPath = path.join(ROOT, "tasks", "specs", `${taskName}.md`);
  if (!existsSync(specPath)) {
    console.error(`Task spec not found: ${specPath}`);
    process.exit(1);
  }
  return readFileSync(specPath, "utf-8");
}

/** Extract the list of file paths from the "Files to touch" line in the spec. */
function parseFilesToTouch(spec: string): string[] {
  const match = spec.match(/##\s*Files to touch[:\s]*([\s\S]*?)(?=\n##|\n---|\z)/i);
  if (!match) return [];
  return match[1]
    .split(/[\n,]/)
    .map((s) => s.trim().replace(/^-\s*/, ""))
    .filter((s) => s.length > 0 && !s.startsWith("#"));
}

/** Read the current content of each file (returns empty string if file doesn't exist yet). */
function loadFileContents(filePaths: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const relPath of filePaths) {
    const absPath = path.join(ROOT, relPath);
    result[relPath] = existsSync(absPath) ? readFileSync(absPath, "utf-8") : "";
  }
  return result;
}

// ---------------------------------------------------------------------------
// Claude API call
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an expert TypeScript/Node.js engineer working on CompliCore, a compliance-first short-term rental platform.

Your job is to implement the changes described in the task spec provided by the user.

Output ONLY the modified files in this exact format — no prose, no markdown fences, no explanations outside of code comments:

--- FILE: <relative-path-from-repo-root> ---
<complete file content>
--- END FILE ---

Rules:
- Output EVERY file that needs changes. Output the COMPLETE file content, not just diffs.
- Preserve existing code style, imports, and patterns unless the spec says otherwise.
- Validate all inputs with Zod at route boundaries (backend convention).
- Never store secrets in code; use environment variables.
- Never disable rate limiting, CORS, or Helmet.
- Always use \`fastify.requireRole\` or \`fastify.authenticate\` on protected routes.
- If a file does not need changes, do NOT include it in the output.
- Do not create new files that were not in "Files to touch" unless absolutely necessary.`;

async function callClaude(
  client: Anthropic,
  spec: string,
  fileContents: Record<string, string>
): Promise<string> {
  const fileContext = Object.entries(fileContents)
    .map(([p, content]) =>
      content
        ? `### Current content of \`${p}\`\n\`\`\`\n${content}\n\`\`\``
        : `### \`${p}\` — (file does not exist yet, create it)`
    )
    .join("\n\n");

  const userMessage = `## Task Spec\n\n${spec}\n\n---\n\n## Current File Contents\n\n${fileContext}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("Claude returned no text block");
  return block.text;
}

// ---------------------------------------------------------------------------
// Response parsing
// ---------------------------------------------------------------------------

interface FilePatch {
  path: string;
  content: string;
}

function parseFilePatches(response: string): FilePatch[] {
  const patches: FilePatch[] = [];
  const regex = /--- FILE: ([^\n]+) ---\n([\s\S]*?)--- END FILE ---/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(response)) !== null) {
    patches.push({ path: match[1].trim(), content: match[2] });
  }
  return patches;
}

// ---------------------------------------------------------------------------
// Git helpers
// ---------------------------------------------------------------------------

function git(cmd: string): string {
  return execSync(`git -C "${ROOT}" ${cmd}`, { encoding: "utf-8" }).trim();
}

function ghAvailable(): boolean {
  try {
    execSync("gh --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function applyAndCommit(patches: FilePatch[], taskName: string, spec: string): string {
  const timestamp = Date.now();
  const branch = `agent/${taskName}-${timestamp}`;

  // Ensure we start from a clean state on the default branch
  const defaultBranch = git("rev-parse --abbrev-ref HEAD");
  console.log(`Current branch: ${defaultBranch}`);

  git(`checkout -b ${branch}`);
  console.log(`Created branch: ${branch}`);

  for (const patch of patches) {
    const absPath = path.join(ROOT, patch.path);
    const dir = path.dirname(absPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(absPath, patch.content, "utf-8");
    console.log(`  Wrote: ${patch.path}`);
  }

  const changedFiles = patches.map((p) => `"${p.path}"`).join(" ");
  git(`add ${changedFiles}`);

  const taskTitle = spec.match(/##\s*Task[:\s]+(.+)/i)?.[1]?.trim() ?? taskName;
  git(`commit -m "agent: ${taskTitle}"`);
  git(`push -u origin ${branch}`);
  console.log(`Pushed branch: ${branch}`);

  if (!ghAvailable()) {
    console.log("gh CLI not found — skipping PR creation. Push the branch and open a PR manually.");
    return branch;
  }

  // Extract acceptance criteria for PR body
  const criteriaMatch = spec.match(/##\s*Acceptance Criteria[:\s]*([\s\S]*?)(?=\n##|\n---|\z)/i);
  const criteria = criteriaMatch ? criteriaMatch[1].trim() : "";

  const body = `## Automated Implementation\n\nGenerated by the Antigravity Builder Agent.\n\n### Task\n${taskTitle}\n\n### Acceptance Criteria\n${criteria}\n\n---\n*Review all changes before merging. See \`.agent-safety.yml\` for agent boundaries.*`;

  const prUrl = execSync(
    `gh pr create --title "agent: ${taskTitle}" --body "${body.replace(/"/g, '\\"')}" --head ${branch}`,
    { encoding: "utf-8", cwd: ROOT }
  ).trim();

  return prUrl;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const taskName = getTaskName();
  console.log(`\nAntigravity Builder — task: ${taskName}\n`);

  const spec = readSpec(taskName);
  const filesToTouch = parseFilesToTouch(spec);
  console.log(`Files to touch: ${filesToTouch.join(", ") || "(none specified)"}`);

  const fileContents = loadFileContents(filesToTouch);

  const client = new Anthropic();
  console.log("Calling Claude...");
  const response = await callClaude(client, spec, fileContents);

  const patches = parseFilePatches(response);
  if (patches.length === 0) {
    console.error("Claude returned no file patches. Raw response:\n", response);
    process.exit(1);
  }
  console.log(`Claude produced ${patches.length} file patch(es).`);

  const result = applyAndCommit(patches, taskName, spec);
  console.log(`\nDone. PR / branch: ${result}\n`);
}

main().catch((err) => {
  console.error("Builder agent error:", err);
  process.exit(1);
});
