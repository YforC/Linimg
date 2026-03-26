import type { VideoOptions } from "@/src/types/workbench";

type VideoOptionsPanelProps = {
  value: VideoOptions;
  onChange: (value: VideoOptions) => void;
};

export function VideoOptionsPanel({ value, onChange }: VideoOptionsPanelProps) {
  return (
    <div className="option-stack">
      <div className="fixed-note" aria-label="视频时长">
        <span className="field-label">视频时长</span>
        <p>固定生成 8 秒，不提供调节</p>
      </div>
      <label className="field">
        <span className="field-label">画面比例</span>
        <select
          aria-label="画面比例"
          value={value.aspectRatio}
          onChange={(event) =>
            onChange({
              ...value,
              aspectRatio: event.target.value as VideoOptions["aspectRatio"],
            })
          }
        >
          <option value="16:9">16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
        </select>
      </label>
      <label className="field">
        <span className="field-label">分辨率</span>
        <select
          aria-label="分辨率"
          value={value.resolution}
          onChange={(event) =>
            onChange({
              ...value,
              resolution: event.target.value as VideoOptions["resolution"],
            })
          }
        >
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </label>
      <label className="field">
        <span className="field-label">运动强度</span>
        <select
          aria-label="运动强度"
          value={value.motion}
          onChange={(event) =>
            onChange({
              ...value,
              motion: event.target.value as VideoOptions["motion"],
            })
          }
        >
          <option value="gentle">柔和</option>
          <option value="dynamic">动态</option>
        </select>
      </label>
    </div>
  );
}
