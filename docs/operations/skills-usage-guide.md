# Usage Guide: How to Actually Use These Skills

> **Confused after installation?** This guide explains exactly what to do next.

---

## Language

English | 简体中文 | 繁體中文 | 日本語 | 한국어

---

## "I just installed the repository. Now what?"

When you run `npx antigravity-awesome-skills` or clone the repository, you:

- ✅ Download skill files locally (default: `~/.gemini/antigravity/skills/`)
- ✅ Make them available to your AI assistant/tool
- ❌ Do **not** auto-enable all skills for every prompt

Think of this as installing a toolbox. You still choose which tools (skills) to use for each task.

---

## Compatibility & Invocation

These skills use the universal `SKILL.md` format and are compatible with major AI coding harnesses.

| Tool           | Type      | Invocation Example          | Path                                                |
| -------------- | --------- | --------------------------- | --------------------------------------------------- |
| Claude Code    | CLI       | `>> /skill-name help me...` | `.claude/skills/`                                   |
| Gemini CLI     | CLI       | `Use skill-name...`         | `.gemini/skills/`                                   |
| Codex CLI      | CLI       | `Use skill-name...`         | `.codex/skills/`                                    |
| Kiro CLI       | CLI       | Auto/on-demand              | `~/.kiro/skills/` or `.kiro/skills/`                |
| Kiro IDE       | IDE       | `/skill-name` or Auto       | `~/.kiro/skills/` or `.kiro/skills/`                |
| Antigravity    | IDE       | `Use @skill-name...`        | `~/.gemini/antigravity/skills/` or `.agent/skills/` |
| Cursor         | IDE       | `@skill-name` in chat       | `.cursor/skills/`                                   |
| OpenCode       | CLI       | `opencode run @skill-name`  | `.agents/skills/`                                   |
| AdaL CLI       | CLI       | Auto/on-demand              | `.adal/skills/`                                     |
| GitHub Copilot | Extension | Paste rules/skills manually | N/A                                                 |

### Tip

- Default installer path: `~/.gemini/antigravity/skills`
- Workspace path for Antigravity: `.agent/skills`
- OpenCode path update: `.agents/skills`

### Warning

Windows users: symlink handling can break skill layout if cloning without symlink support.

---

## Installation

### Option A — npx (recommended)

```bash
npx antigravity-awesome-skills
```

Verify default install:

```bash
test -d ~/.gemini/antigravity/skills && echo "Skills installed in ~/.gemini/antigravity/skills"
```

Use your first skill:

```text
Use @brainstorming to plan a SaaS MVP.
```

### Tool-specific install quick map

| Tool        | Install                                                | First Use                                            |
| ----------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Claude Code | `npx antigravity-awesome-skills --claude`              | `>> /brainstorming help me plan a feature`           |
| Cursor      | `npx antigravity-awesome-skills --cursor`              | `@brainstorming help me plan a feature`              |
| Gemini CLI  | `npx antigravity-awesome-skills --gemini`              | `Use brainstorming to plan a feature`                |
| Codex CLI   | `npx antigravity-awesome-skills --codex`               | `Use brainstorming to plan a feature`                |
| Antigravity | `npx antigravity-awesome-skills --antigravity`         | `Use @brainstorming to plan a feature`               |
| Kiro CLI    | `npx antigravity-awesome-skills --kiro`                | `Use brainstorming to plan a feature`                |
| Kiro IDE    | `npx antigravity-awesome-skills --path ~/.kiro/skills` | `Use @brainstorming to plan a feature`               |
| OpenCode    | `npx antigravity-awesome-skills --path .agents/skills` | `opencode run @brainstorming help me plan a feature` |
| AdaL CLI    | `npx antigravity-awesome-skills --path .adal/skills`   | `Use brainstorming to plan a feature`                |

---

## Bundles vs Workflows (Most Common Confusion)

### Bundles are NOT separate installs

Bundles are role-based recommendations (for example: Web Wizard, Security Engineer, Essentials).

- ✅ Recommended skill lists
- ✅ Curated starting points
- ❌ Not separate downloads
- ❌ Not something to “activate”

How to use bundles:

1. Install once.
2. Pick your role bundle.
3. Start with 3–5 skills from that bundle.
4. Invoke those skills in prompts.

### Workflows are execution order

- Use **bundles** to decide _what_ skills to pick.
- Use **workflows** to decide _which order_ to run them.

---

## How to invoke a skill

Mention the skill directly in your prompt.

```text
Use @brainstorming to design a user profile page.
Use @lint-and-validate on apps/api/main.py.
Use @api-security-best-practices to review auth routes.
```

For better results:

- Name the exact skill.
- Include target files/scope.
- State expected output.

---

## First Skills to Start With

### Essentials (general use)

1. `@brainstorming`
2. `@lint-and-validate`
3. `@git-pushing`
4. `@systematic-debugging`
5. `@concise-planning`

### Role routing

- Web Dev → start with Web Wizard
- Security → start with Security Engineer
- General product/ops → start with Essentials

Suggested sequence:

- Before coding → `@brainstorming`
- After coding → `@lint-and-validate`
- Before commit/push → `@git-pushing`
- When blocked → `@systematic-debugging`

---

## Three Real Examples

1. `Use @brainstorming to turn this product idea into a concrete MVP plan.`
2. `Use @security-auditor to review this API endpoint for auth and validation risks.`
3. `Use @lint-and-validate on packages/workflows/operator_copilot.py.`

---

## Quick Reference Card

| Task           | Skill to Use                   | Example Prompt                                   |
| -------------- | ------------------------------ | ------------------------------------------------ |
| Plan feature   | `@brainstorming`               | `Use @brainstorming to design a login system`    |
| Review code    | `@lint-and-validate`           | `Use @lint-and-validate on src/app.js`           |
| Debug issue    | `@systematic-debugging`        | `Use @systematic-debugging to fix login error`   |
| Security audit | `@api-security-best-practices` | `Use @api-security-best-practices on API routes` |
| SEO check      | `@seo-audit`                   | `Use @seo-audit on landing page`                 |
| Deploy         | `@vercel-deployment`           | `Use @vercel-deployment to ship this app`        |

---

## Troubleshooting

### Windows symlink problems

Clone with symlink support:

```bash
git clone -c core.symlinks=true https://github.com/sickn33/antigravity-awesome-skills.git .agent/skills
```

Or enable Windows Developer Mode before cloning.

### Skill not detected

1. Restart your IDE/CLI session.
2. Verify the install path matches your tool.
3. Re-run install with tool-specific flag or explicit `--path`.

### Can I load all skills into one prompt?

No. Install all if you want, but invoke only the skills needed for the task.

---

## Next Steps

1. Try one skill now: `Use @brainstorming to plan a SaaS MVP.`
2. Run validation next: `Use @lint-and-validate on <your file>.`
3. Pick 3–5 role skills from a bundle.
4. Chain skills: Plan → Build → Validate → Deploy.

See also:

- `docs/operations/first-runnable-layer.md`
- `docs/operations/worker-layer-startup.md`
- `docs/operations/saas-mvp-brainstorm.md`
