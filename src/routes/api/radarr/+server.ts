import type { RequestHandler } from "@sveltejs/kit";
import { loadConfig } from "$lib/config";

export const GET: RequestHandler = async () => {
  const config = loadConfig();
  if (!config?.radarrUrl || !config?.radarrApiKey) {
    return new Response("Radarr not configured", { status: 400 });
  }
  try {
    const res = await fetch(`${config.radarrUrl}/api/v3/movie`, {
      headers: { "X-Api-Key": config.radarrApiKey }
    });
    if (!res.ok) {
      return new Response("Failed to fetch Radarr movies", { status: 502 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(`Error contacting Radarr: ${msg}`, { status: 500 });
  }
};