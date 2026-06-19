/// <reference types="vite/client" />

function normalizeEnvValue(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.toLowerCase() === "undefined") {
    return fallback;
  }

  return trimmed.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: normalizeEnvValue(
    import.meta.env.VITE_API_BASE_URL,
    "http://localhost:3000",
  ),
  wsBaseUrl: normalizeEnvValue(
    import.meta.env.VITE_WS_BASE_URL,
    "ws://localhost:8080",
  ),
  appName: normalizeEnvValue(
    import.meta.env.VITE_APP_NAME,
    "Office Metaverse",
  ),
};
