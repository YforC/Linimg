export type WorkbenchMode = "image" | "video";

export type RequestStatus = "idle" | "loading" | "success" | "error";

export type ImageOptions = {
  size: "1024x1024" | "1536x1024" | "1024x1536";
  quality: "standard" | "hd";
  count: number;
  style: "natural" | "vivid";
};

export type VideoOptions = {
  duration: "8s";
  aspectRatio: "16:9" | "9:16";
  resolution: "720p" | "1080p";
  motion: "gentle" | "dynamic";
};

export type GenerationResult = {
  mode: WorkbenchMode;
  assetUrl: string;
  thumbnailUrl?: string;
};

export type HistoryItem = GenerationResult & {
  id: string;
  prompt: string;
  createdAt: string;
};
