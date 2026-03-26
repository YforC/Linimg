import type { HistoryItem } from "@/src/types/workbench";

export function normalizeVideoResponse(params: {
  prompt: string;
  assetUrl?: string;
  thumbnailUrl?: string;
}): HistoryItem {
  return {
    id: crypto.randomUUID(),
    mode: "video",
    prompt: params.prompt,
    createdAt: new Date().toISOString(),
    assetUrl: params.assetUrl ?? "",
    thumbnailUrl: params.thumbnailUrl,
  };
}
