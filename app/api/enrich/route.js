import { spawn } from "child_process";
import path from "path";

const PYTHON = path.join(process.cwd(), "venv/bin/python");
const SCRIPT = path.join(process.cwd(), "scripts/enrich.py");

export async function POST(request) {
  const { website } = await request.json();

  if (!website?.trim()) {
    return Response.json({ error: "Website URL is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    const proc = spawn(PYTHON, [SCRIPT, website], {
      env: { ...process.env, OPENAI_API_KEY: apiKey },
      timeout: 60000,
    });

    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      // Find the last JSON object in stdout (scrapegraphai may log before it)
      const jsonMatch = stdout.match(/(\{[\s\S]*\})\s*$/);
      if (!jsonMatch) {
        resolve(Response.json(
          { error: "Failed to parse enrichment result", detail: stderr || stdout },
          { status: 500 }
        ));
        return;
      }

      try {
        const raw = JSON.parse(jsonMatch[1]);
        if (raw.error) {
          resolve(Response.json({ error: raw.error }, { status: 500 }));
        } else {
          // scrapegraphai wraps result in { content: {...} } — unwrap it
          const data = raw.content ?? raw;
          resolve(Response.json(data));
        }
      } catch {
        resolve(Response.json({ error: "Invalid JSON from enrichment script" }, { status: 500 }));
      }
    });

    proc.on("error", (err) => {
      resolve(Response.json({ error: err.message }, { status: 500 }));
    });
  });
}
