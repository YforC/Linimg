import { ImageOptionsPanel } from "@/src/components/workbench/image-options-panel";
import { VideoOptionsPanel } from "@/src/components/workbench/video-options-panel";
import type { ImageOptions, VideoOptions, WorkbenchMode } from "@/src/types/workbench";

type OptionsShellProps = {
  mode: WorkbenchMode;
  imageOptions: ImageOptions;
  videoOptions: VideoOptions;
  onImageChange: (value: ImageOptions) => void;
  onVideoChange: (value: VideoOptions) => void;
};

export function OptionsShell({
  mode,
  imageOptions,
  videoOptions,
  onImageChange,
  onVideoChange,
}: OptionsShellProps) {
  return mode === "image" ? (
    <ImageOptionsPanel value={imageOptions} onChange={onImageChange} />
  ) : (
    <VideoOptionsPanel value={videoOptions} onChange={onVideoChange} />
  );
}
