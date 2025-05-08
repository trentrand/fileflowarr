import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export interface FlowarrConfig {
  sonarrUrl: string;
  sonarrApiKey: string;
  radarrUrl: string;
  radarrApiKey: string;
  fileflowsUrl: string;
}

const CONFIG_PATH = path.resolve(process.cwd(), "config.json");

export function loadConfig(): FlowarrConfig | null {
  if (!existsSync(CONFIG_PATH)) return null;
  const raw = readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as FlowarrConfig;
}

export function saveConfig(config: FlowarrConfig) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}