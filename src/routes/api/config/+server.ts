import type { RequestHandler } from "@sveltejs/kit";
import { loadConfig, saveConfig, type FlowarrConfig } from "$lib/config";

export const GET: RequestHandler = async () => {
  const config = loadConfig();
  return new Response(JSON.stringify(config), {
    headers: { "Content-Type": "application/json" }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as FlowarrConfig;
  saveConfig(data);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};