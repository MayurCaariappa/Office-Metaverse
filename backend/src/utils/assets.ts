import path from "node:path";

export function normalizeAssetPath(...parts: string[]) {
  return path.posix.join(...parts).replace(/\\/g, "/");
}

export function buildAssetUrl(assetBaseUrl: string, imagePath: string) {
  const sanitized = imagePath.replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${assetBaseUrl}/${sanitized}`;
}
