import type { WorkbenchMode } from "@/src/types/workbench";

export function EmptyState({ mode }: { mode: WorkbenchMode }) {
  return (
    <div className="state-card">
      <p className="state-title">输入描述后开始生成</p>
      <p className="state-description">
        {mode === "image"
          ? "你会在这里看到生成图片的结果。"
          : "你会在这里看到生成视频的结果。"}
      </p>
    </div>
  );
}
