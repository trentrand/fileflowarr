import type { RequestHandler } from "@sveltejs/kit";
import { loadConfig } from "$lib/config";

export const GET: RequestHandler = async () => {
  const config = loadConfig();
  if (!config?.fileflowsUrl) {
    return new Response("FileFlows URL not configured", { status: 400 });
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${config.fileflowsUrl}/api/library`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      return new Response("Failed to fetch FileFlows libraries", { status: 502 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(`Error contacting FileFlows: ${msg}`, { status: 500 });
  }
};