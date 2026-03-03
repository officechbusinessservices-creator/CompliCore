#!/usr/bin/env tsx
/**
 * Antigravity Digest Agent
 *
 * Gathers overnight activity (git log, open/merged PRs) and asks Claude to
 * format a concise morning briefing. Writes the digest to tasks/digest-latest.md
 * and prints it to stdout (captured as a GitHub Actions artifact).
 *
 * Usage:
 *   npm run agent:digest
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/agents/digest.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "../..");

// ---------------------------------------------------------------------------
// Data collection
// ---------------------------------------------------------------------------

function safeExec(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf-8", cwd: ROOT }).trim();
  } catch {
    return "(unavailable)";
  }
}

function collectContext(): string {
  const commits24h = safeExec("git log --oneline --since='24 hours ago'");
  const openPRs = safeExec(
    "gh pr list --json title,url,state,headRefName,author --limit 20 2>/dev/null || echo '[]'"
  );
  const mergedPRs = safeExec(
    "gh pr list --json title,url,state --state merged --limit 10 2>/dev/null || echo '[]'"
  );
  const failedWorkflows = safeExec(
    "gh run list --limit 5 --json displayTitle,status,conclusion 2>/dev/null || echo '[]'"
  );

  return [
    `## Git commits in the last 24 hours\n${commits24h || "(none)"}`,
    `## Open pull requests\n${openPRs}`,
    `## Recently merged pull requests\n${mergedPRs}`,
    `## Recent workflow runs\n${failedWorkflows}`,
  ].join("\n\n");
}

// ---------------------------------------------------------------------------
// Claude call
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a senior engineering lead writing a morning briefing for a founder/CTO.
Summarise what the Antigravity AI agents did overnight in a format that can be read in under 3 minutes.

Format:
# Morning Digest — {DATE}

## TL;DR
(2–3 sentences: what happened, what needs review)

## PRs Opened
(bullet list: title, link if available, status)

## PRs Merged
(bullet list: title, link if available)

## Commits
(bullet list of notable commits, skip trivial bumps)

## Workflow Health
(pass/fail summary for recent CI runs)

## Action Required
(numbered list of things the human must do today: merge PRs, approve changes, etc.)

Keep it factual, skip fluff. Use markdown.`;

async function generateDigest(client: Anthropic, context: string): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Today is ${today}. Here is the raw data from the last 24 hours:\n\n${context}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("Claude returned no text block");
  return block.text;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Antigravity Digest — collecting overnight context...\n");

  const context = collectContext();
  const client = new Anthropic();
  const digest = await generateDigest(client, context);

  // Write to file (uploaded as workflow artifact)
  const outDir = path.join(ROOT, "tasks");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "digest-latest.md");
  writeFileSync(outPath, digest, "utf-8");

  // Print to stdout
  console.log(digest);
  console.log(`\nDigest written to: ${outPath}`);
}

main().catch((err) => {
  console.error("Digest agent error:", err);
  process.exit(1);
});
