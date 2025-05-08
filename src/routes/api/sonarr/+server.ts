import type { RequestHandler } from "@sveltejs/kit";
import { loadConfig } from "$lib/config";

export const GET: RequestHandler = async () => {
  const config = loadConfig();
  if (!config?.sonarrUrl || !config?.sonarrApiKey) {
    return new Response("Sonarr not configured", { status: 400 });
  }
  try {
    const res = await fetch(`${config.sonarrUrl}/api/series`, {
      headers: { "X-Api-Key": config.sonarrApiKey }
    });
    if (!res.ok) {
      return new Response("Failed to fetch Sonarr series", { status: 502 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(`Error contacting Sonarr: ${msg}`, { status: 500 });
  }
};