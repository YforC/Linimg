import type { ImageOptions, VideoOptions } from "@/src/types/workbench";

export const workbenchModes = ["image", "video"] as const;

export const defaultImageOptions: ImageOptions = {
  size: "1024x1024",
  quality: "standard",
  count: 1,
  style: "natural",
};

export const defaultVideoOptions: VideoOptions = {
  duration: "8s",
  aspectRatio: "16:9",
  resolution: "720p",
  motion: "gentle",
};

export const promptIdeas = [
  "苔藓庭院里的木质长椅，晨雾，柔和自然光",
  "山谷中的溪流和蕨类植物，低机位，空气湿润",
  "风吹过稻田的航拍镜头，午后阳光，纪录片感",
];
