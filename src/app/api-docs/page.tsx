import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import Link from "next/link";

type OpenApiOperation = {
  summary?: string;
  description?: string;
  responses?: Record<string, { description?: string }>;
};

type OpenApiSpec = {
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  servers?: Array<{ url: string; description?: string }>;
  paths?: Record<string, Record<string, OpenApiOperation>>;
};

type OperationRow = {
  method: string;
  path: string;
  summary: string;
  description: string;
  responses: Array<{ code: string; description: string }>;
};

async function loadSpec(): Promise<OpenApiSpec> {
  const specPath = path.join(process.cwd(), "specs", "openapi.yaml");
  const raw = await fs.readFile(specPath, "utf8");
  const parsed = yaml.load(raw);
  return (parsed ?? {}) as OpenApiSpec;
}

function extractOperations(spec: OpenApiSpec): OperationRow[] {
  const rows: OperationRow[] = [];
  const methods = ["get", "post", "put", "patch", "delete"];

  for (const [routePath, routeDef] of Object.entries(spec.paths ?? {})) {
    for (const method of methods) {
      const op = routeDef?.[method];
      if (!op) continue;

      rows.push({
        method: method.toUpperCase(),
        path: routePath,
        summary: op.summary || "Untitled operation",
        description: op.description || "",
        responses: Object.entries(op.responses ?? {}).map(([code, response]) => ({
          code,
          description: response?.description || "No description",
        })),
      });
    }
  }

  return rows;
}

export default async function ApiDocsPage() {
  const spec = await loadSpec();
  const operations = extractOperations(spec);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{spec.info?.title || "API Reference"}</h1>
            <p className="text-sm text-muted-foreground">OpenAPI source: `specs/openapi.yaml`</p>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-3">{spec.info?.description || "No description provided."}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full border border-border">Version {spec.info?.version || "n/a"}</span>
            {(spec.servers || []).map((server) => (
              <span key={server.url} className="px-2.5 py-1 rounded-full border border-border">
                {server.description ? `${server.description}: ` : ""}
                {server.url}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {operations.map((op) => (
            <article key={`${op.method}:${op.path}`} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold border border-border">{op.method}</span>
                <code className="text-sm">{op.path}</code>
              </div>
              <h2 className="font-semibold">{op.summary}</h2>
              {op.description ? <p className="text-sm text-muted-foreground mt-1">{op.description}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {op.responses.map((resp) => (
                  <span key={`${op.method}:${op.path}:${resp.code}`} className="text-xs px-2 py-1 rounded border border-border">
                    {resp.code}: {resp.description}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
