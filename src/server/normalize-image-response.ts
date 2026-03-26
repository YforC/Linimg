import type { HistoryItem } from "@/src/types/workbench";

export function normalizeImageResponse(params: {
  prompt: string;
  assetUrl?: string;
}): HistoryItem {
  return {
    id: crypto.randomUUID(),
    mode: "image",
    prompt: params.prompt,
    createdAt: new Date().toISOString(),
    assetUrl: params.assetUrl ?? "",
  };
}
