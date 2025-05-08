import type { RequestHandler } from "@sveltejs/kit";
import { loadConfig } from "$lib/config";

export const POST: RequestHandler = async ({ request }) => {
  const config = loadConfig();
  if (!config?.fileflowsUrl) {
    return new Response("FileFlows URL not configured", { status: 400 });
  }
  const body = await request.json();
  try {
    // Determine flow name and fetch all flows
    const flowName = body.Flow?.Name;
    if (!flowName) {
      return new Response("Flow name required", { status: 400 });
    }
    const flowsRes = await fetch(`${config.fileflowsUrl}/api/flow/list-all`);
    if (!flowsRes.ok) {
      return new Response("Failed to fetch flows from FileFlows", { status: 502 });
    }
    const flows = await flowsRes.json();
    const flow = flows.find((f: any) => f.Name === flowName);
    if (!flow) {
      return new Response(`Flow "${flowName}" not found`, { status: 400 });
    }
    // Attach Uid to Flow
    body.Flow.Uid = flow.Uid;
    const res = await fetch(`${config.fileflowsUrl}/api/library`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      return new Response("Failed to add library to FileFlows", { status: 502 });
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