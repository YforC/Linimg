import type { WorkbenchMode } from "@/src/types/workbench";

type WorkbenchView = WorkbenchMode | "history";

type ModeSwitchProps = {
  value: WorkbenchView;
  onChange: (mode: WorkbenchView) => void;
};

export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch" role="tablist" aria-label="生成模式">
      <button
        className={value === "image" ? "mode-button active" : "mode-button"}
        type="button"
        aria-pressed={value === "image"}
        onClick={() => onChange("image")}
      >
        生成图片
      </button>
      <button
        className={value === "video" ? "mode-button active" : "mode-button"}
        type="button"
        aria-pressed={value === "video"}
        onClick={() => onChange("video")}
      >
        生成视频
      </button>
      <button
        className={value === "history" ? "mode-button active" : "mode-button"}
        type="button"
        aria-pressed={value === "history"}
        onClick={() => onChange("history")}
      >
        历史记录
      </button>
    </div>
  );
}
