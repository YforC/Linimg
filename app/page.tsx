"use client";

import { useEffect, useState } from "react";
import { defaultImageOptions, defaultVideoOptions } from "@/src/config/workbench";
import { HistoryList } from "@/src/components/workbench/history-list";
import { ModeSwitch } from "@/src/components/workbench/mode-switch";
import { OptionsShell } from "@/src/components/workbench/options-shell";
import { PromptComposer } from "@/src/components/workbench/prompt-composer";
import { ResultPanel } from "@/src/components/workbench/result-panel";
import { postJson } from "@/src/lib/request";
import type {
  GenerationResult,
  HistoryItem,
  RequestStatus,
  WorkbenchMode,
} from "@/src/types/workbench";

const HISTORY_STORAGE_KEY = "img-and-veo-history";

function loadStoredHistory() {
  if (typeof window === "undefined") {
    return [] as HistoryItem[];
  }

  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [] as HistoryItem[];
  }

  try {
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [mode, setMode] = useState<WorkbenchMode>("image");
  const [activePanel, setActivePanel] = useState<WorkbenchMode | "history">("image");
  const [prompt, setPrompt] = useState("");
  const [imageOptions, setImageOptions] = useState(defaultImageOptions);
  const [videoOptions, setVideoOptions] = useState(defaultVideoOptions);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyReady, setHistoryReady] = useState(false);

  useEffect(() => {
    setHistory(loadStoredHistory());
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    if (!historyReady) {
      return;
    }

    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history, historyReady]);

  async function handleSubmit() {
    if (!prompt.trim()) {
      setError("请输入创作描述");
      setStatus("error");
      return;
    }

    const endpoint = mode === "image" ? "/api/generate-image" : "/api/generate-video";

    setStatus("loading");
    setError(null);

    try {
      const payload = await postJson<{ data: HistoryItem }>(endpoint, {
        prompt,
        options: mode === "image" ? imageOptions : videoOptions,
      });

      setResult(payload.data);
      setHistory((current) => [payload.data, ...current]);
      setStatus("success");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "生成失败，请重试");
      setStatus("error");
    }
  }

  return (
    <main className="page-shell">
      <PromptComposer value={prompt} onChange={setPrompt} />

      <section className="switch-shell">
        <ModeSwitch
          value={activePanel}
          onChange={(panel) => {
            setActivePanel(panel);
            if (panel === "image" || panel === "video") {
              setMode(panel);
            }
          }}
        />
      </section>

      <section className="panel stage-shell" aria-label="主内容区">
        {activePanel === "history" ? (
          <section className="history-panel">
            <HistoryList items={history} onReuse={setPrompt} />
          </section>
        ) : (
          <div className="stage-grid">
            <section className="panel panel-subtle options-panel" aria-label="参数与提交">
              <div className="panel-heading">
                <h3>{mode === "image" ? "图片" : "视频"}</h3>
              </div>
              <OptionsShell
                mode={mode}
                imageOptions={imageOptions}
                videoOptions={videoOptions}
                onImageChange={setImageOptions}
                onVideoChange={setVideoOptions}
              />
              <button
                className="primary-button"
                type="button"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? mode === "image"
                    ? "正在生成图片"
                    : "正在生成视频"
                  : mode === "image"
                    ? "开始生成图片"
                    : "开始生成视频"}
              </button>
            </section>

            <section className="panel panel-subtle result-shell" aria-label="当前结果">
              <ResultPanel error={error} mode={mode} result={result} status={status} />
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
