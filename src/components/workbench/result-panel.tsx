import { EmptyState } from "@/src/components/workbench/empty-state";
import { ErrorState } from "@/src/components/workbench/error-state";
import type { GenerationResult, RequestStatus, WorkbenchMode } from "@/src/types/workbench";

type ResultPanelProps = {
  status: RequestStatus;
  mode: WorkbenchMode;
  result: GenerationResult | null;
  error: string | null;
};

export function ResultPanel({ status, mode, result, error }: ResultPanelProps) {
  if (status === "idle") {
    return <EmptyState mode={mode} />;
  }

  if (status === "loading") {
    return (
      <div className="state-card loading">
        <p className="state-title">正在生成，请稍候</p>
        <p className="state-description">系统正在整理你的创作描述并请求模型生成内容。</p>
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState message={error ?? "生成失败，请重试"} />;
  }

  if (!result) {
    return <EmptyState mode={mode} />;
  }

  return mode === "image" ? (
    <figure className="result-card">
      <img className="result-image" src={result.assetUrl} alt="生成结果" draggable="false" />
      <figcaption>图片结果</figcaption>
    </figure>
  ) : (
    <div className="result-card">
      <video className="result-video" src={result.assetUrl} controls />
      <p>视频结果</p>
    </div>
  );
}
