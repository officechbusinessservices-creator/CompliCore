# CLAUDE_TASK_TEMPLATES.md

## Project instructions
Treat COMPLICORE_PLUS_MASTER_SPEC.md as the sole source of truth.
Use only the minimum relevant files for each task.
Do not restate unchanged context.
Return deltas, final artifacts, or patches only.
Never invent metrics, revenue, subscription state, or billing data.
Do not merge architecture, design, copy, and backend unless explicitly requested.
For build tasks, work in the defined execution order:
architecture → design system → copy → Figma prompts → frontend → backend wiring → QA.

## Task prompt template
Task: [single output]
Use only: [file names]
Focus sections: [specific sections]
Output format: [bullet list / markdown / code / patch]
Exclude: [what not to touch]
Return only final result

## Examples
Task: Write final /pricing page copy
Use only: 03_SITE_COPY.md, COMPLICORE_PLUS_MASTER_SPEC.md
Focus sections: pricing logic, packages, CTA hierarchy
Output format: production-ready page copy
Exclude: homepage, backend, dashboard
Return only final result

Task: Build Supabase migration order
Use only: 05_DATA_AND_BACKEND_SPEC.md
Focus sections: schema, Stripe webhook truth, seed flow catalog
Output format: ordered SQL migration plan
Exclude: marketing pages, Figma, copy
Return only final result

Task: Generate homepage component tree
Use only: 01_ARCHITECTURE_SPEC.md, 02_DESIGN_SYSTEM.md, 03_SITE_COPY.md
Focus sections: homepage wireframe, tokens, hero/KPI/pricing sections
Output format: React component map with props
Exclude: dashboard, Supabase schema
Return only final result
