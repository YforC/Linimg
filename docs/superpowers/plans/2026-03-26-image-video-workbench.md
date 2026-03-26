# 图片与视频生成工作台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Next.js App Router 的单页创作工作台，支持图片生成与视频生成，并通过服务端 API Route 代理 OpenAI SDK 风格接口。

**Architecture:** 使用 `app/page.tsx` 作为页面入口，拆分输入区、模式切换、参数面板、结果展示和历史记录组件。服务端通过两个 API Route 统一封装图片与视频生成调用，前端仅消费规范化响应结构并维护会话内状态。

**Tech Stack:** Next.js 15+, React, TypeScript, App Router, Route Handlers, OpenAI SDK, Tailwind CSS, Vitest or Jest with Testing Library

---

### Task 1: 初始化 Next.js 工程骨架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `.env.example`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: 写初始化存在性测试**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

describe("HomePage", () => {
  it("renders the workbench heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /生成图像与视频/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- home-page.test.tsx`
Expected: FAIL with "Cannot find module '../app/page'" or missing Next.js project files

- [ ] **Step 3: 创建最小可运行骨架**

```tsx
// app/page.tsx
export default function HomePage() {
  return <h1>生成图像与视频</h1>;
}
```

```tsx
// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f5f1e8;
  color: #2f3426;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- home-page.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add package.json tsconfig.json next.config.ts next-env.d.ts postcss.config.js tailwind.config.ts .env.example app/layout.tsx app/page.tsx app/globals.css
git commit -m "feat: bootstrap nextjs workbench app"
```

### Task 2: 定义工作台核心类型与默认配置

**Files:**
- Create: `src/types/workbench.ts`
- Create: `src/config/workbench.ts`
- Test: `src/config/workbench.test.ts`

- [ ] **Step 1: 写默认模式与参数测试**

```ts
import { defaultImageOptions, defaultVideoOptions, workbenchModes } from "./workbench";

describe("workbench config", () => {
  it("defaults to image mode options", () => {
    expect(workbenchModes).toEqual(["image", "video"]);
    expect(defaultImageOptions.size).toBe("1024x1024");
    expect(defaultVideoOptions.duration).toBe("5s");
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/config/workbench.test.ts`
Expected: FAIL with "Cannot find module './workbench'"

- [ ] **Step 3: 创建类型与默认配置**

```ts
// src/types/workbench.ts
export type WorkbenchMode = "image" | "video";

export type ImageOptions = {
  size: string;
  quality: string;
  count: number;
  style: string;
};

export type VideoOptions = {
  duration: string;
  aspectRatio: string;
  resolution: string;
  motion: string;
};

export type HistoryItem = {
  id: string;
  mode: WorkbenchMode;
  prompt: string;
  createdAt: string;
  assetUrl: string;
  thumbnailUrl?: string;
};
```

```ts
// src/config/workbench.ts
export const workbenchModes = ["image", "video"] as const;

export const defaultImageOptions = {
  size: "1024x1024",
  quality: "standard",
  count: 1,
  style: "natural",
};

export const defaultVideoOptions = {
  duration: "5s",
  aspectRatio: "16:9",
  resolution: "720p",
  motion: "gentle",
};
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- src/config/workbench.test.ts`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add src/types/workbench.ts src/config/workbench.ts src/config/workbench.test.ts
git commit -m "feat: add workbench types and defaults"
```

### Task 3: 实现统一创作输入区与模式切换

**Files:**
- Create: `src/components/workbench/prompt-composer.tsx`
- Create: `src/components/workbench/mode-switch.tsx`
- Modify: `app/page.tsx`
- Test: `src/components/workbench/prompt-composer.test.tsx`

- [ ] **Step 1: 写交互测试**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "../../../app/page";

describe("prompt composer", () => {
  it("keeps prompt when switching modes", () => {
    render(<HomePage />);
    fireEvent.change(screen.getByLabelText("创作描述"), {
      target: { value: "薄雾森林里的木屋，清晨光线" },
    });
    fireEvent.click(screen.getByRole("button", { name: "生成视频" }));
    expect(screen.getByDisplayValue("薄雾森林里的木屋，清晨光线")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/components/workbench/prompt-composer.test.tsx`
Expected: FAIL because label, switcher, or state handling does not exist yet

- [ ] **Step 3: 实现输入区与模式切换**

```tsx
// src/components/workbench/prompt-composer.tsx
type PromptComposerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PromptComposer({ value, onChange }: PromptComposerProps) {
  return (
    <label>
      <span>创作描述</span>
      <textarea
        aria-label="创作描述"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="描述你想生成的画面、风格、主体和氛围"
      />
    </label>
  );
}
```

```tsx
// src/components/workbench/mode-switch.tsx
import type { WorkbenchMode } from "@/src/types/workbench";

type ModeSwitchProps = {
  value: WorkbenchMode;
  onChange: (mode: WorkbenchMode) => void;
};

export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  return (
    <div>
      <button type="button" aria-pressed={value === "image"} onClick={() => onChange("image")}>
        生成图片
      </button>
      <button type="button" aria-pressed={value === "video"} onClick={() => onChange("video")}>
        生成视频
      </button>
    </div>
  );
}
```

```tsx
// app/page.tsx
"use client";

import { useState } from "react";
import { ModeSwitch } from "@/src/components/workbench/mode-switch";
import { PromptComposer } from "@/src/components/workbench/prompt-composer";
import type { WorkbenchMode } from "@/src/types/workbench";

export default function HomePage() {
  const [mode, setMode] = useState<WorkbenchMode>("image");
  const [prompt, setPrompt] = useState("");

  return (
    <main>
      <h1>生成图像与视频</h1>
      <PromptComposer value={prompt} onChange={setPrompt} />
      <ModeSwitch value={mode} onChange={setMode} />
    </main>
  );
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- src/components/workbench/prompt-composer.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx src/components/workbench/prompt-composer.tsx src/components/workbench/mode-switch.tsx src/components/workbench/prompt-composer.test.tsx
git commit -m "feat: add prompt composer and mode switch"
```

### Task 4: 实现图片与视频参数面板

**Files:**
- Create: `src/components/workbench/image-options-panel.tsx`
- Create: `src/components/workbench/video-options-panel.tsx`
- Create: `src/components/workbench/options-shell.tsx`
- Modify: `app/page.tsx`
- Test: `src/components/workbench/options-panel.test.tsx`

- [ ] **Step 1: 写模式切换参数测试**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "../../../app/page";

describe("options panels", () => {
  it("shows video fields after switching to video mode", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "生成视频" }));
    expect(screen.getByLabelText("视频时长")).toBeInTheDocument();
    expect(screen.queryByLabelText("图片尺寸")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/components/workbench/options-panel.test.tsx`
Expected: FAIL because the option panels are not rendered yet

- [ ] **Step 3: 实现参数面板**

```tsx
// src/components/workbench/image-options-panel.tsx
import type { ImageOptions } from "@/src/types/workbench";

type ImageOptionsPanelProps = {
  value: ImageOptions;
  onChange: (value: ImageOptions) => void;
};

export function ImageOptionsPanel({ value, onChange }: ImageOptionsPanelProps) {
  return (
    <label>
      <span>图片尺寸</span>
      <select
        aria-label="图片尺寸"
        value={value.size}
        onChange={(event) => onChange({ ...value, size: event.target.value })}
      >
        <option value="1024x1024">1024x1024</option>
        <option value="1536x1024">1536x1024</option>
      </select>
    </label>
  );
}
```

```tsx
// src/components/workbench/video-options-panel.tsx
import type { VideoOptions } from "@/src/types/workbench";

type VideoOptionsPanelProps = {
  value: VideoOptions;
  onChange: (value: VideoOptions) => void;
};

export function VideoOptionsPanel({ value, onChange }: VideoOptionsPanelProps) {
  return (
    <label>
      <span>视频时长</span>
      <select
        aria-label="视频时长"
        value={value.duration}
        onChange={(event) => onChange({ ...value, duration: event.target.value })}
      >
        <option value="5s">5 秒</option>
        <option value="10s">10 秒</option>
      </select>
    </label>
  );
}
```

```tsx
// src/components/workbench/options-shell.tsx
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

export function OptionsShell(props: OptionsShellProps) {
  if (props.mode === "image") {
    return <ImageOptionsPanel value={props.imageOptions} onChange={props.onImageChange} />;
  }

  return <VideoOptionsPanel value={props.videoOptions} onChange={props.onVideoChange} />;
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- src/components/workbench/options-panel.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx src/components/workbench/image-options-panel.tsx src/components/workbench/video-options-panel.tsx src/components/workbench/options-shell.tsx src/components/workbench/options-panel.test.tsx
git commit -m "feat: add image and video option panels"
```

### Task 5: 实现结果区与空状态、加载态、错误态

**Files:**
- Create: `src/components/workbench/result-panel.tsx`
- Create: `src/components/workbench/empty-state.tsx`
- Create: `src/components/workbench/error-state.tsx`
- Modify: `app/page.tsx`
- Test: `src/components/workbench/result-panel.test.tsx`

- [ ] **Step 1: 写结果状态测试**

```tsx
import { render, screen } from "@testing-library/react";
import { ResultPanel } from "./result-panel";

describe("result panel", () => {
  it("renders empty state before generation", () => {
    render(<ResultPanel status="idle" mode="image" result={null} error={null} />);
    expect(screen.getByText("输入描述后开始生成")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/components/workbench/result-panel.test.tsx`
Expected: FAIL because ResultPanel does not exist yet

- [ ] **Step 3: 实现结果状态组件**

```tsx
// src/components/workbench/result-panel.tsx
type ResultPanelProps = {
  status: "idle" | "loading" | "success" | "error";
  mode: "image" | "video";
  result: { assetUrl: string; thumbnailUrl?: string } | null;
  error: string | null;
};

export function ResultPanel({ status, mode, result, error }: ResultPanelProps) {
  if (status === "idle") {
    return <p>输入描述后开始生成</p>;
  }

  if (status === "loading") {
    return <p>正在生成，请稍候</p>;
  }

  if (status === "error") {
    return <p>{error ?? "生成失败，请重试"}</p>;
  }

  if (!result) {
    return <p>暂无结果</p>;
  }

  if (mode === "image") {
    return <img src={result.assetUrl} alt="生成结果" />;
  }

  return <video src={result.assetUrl} controls />;
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- src/components/workbench/result-panel.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx src/components/workbench/result-panel.tsx src/components/workbench/empty-state.tsx src/components/workbench/error-state.tsx src/components/workbench/result-panel.test.tsx
git commit -m "feat: add workbench result states"
```

### Task 6: 实现会话历史记录与 prompt 复用

**Files:**
- Create: `src/components/workbench/history-list.tsx`
- Modify: `app/page.tsx`
- Test: `src/components/workbench/history-list.test.tsx`

- [ ] **Step 1: 写历史复用测试**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { HistoryList } from "./history-list";

describe("history list", () => {
  it("calls reuse when clicking a history item", () => {
    const handleReuse = vi.fn();
    render(
      <HistoryList
        items={[
          {
            id: "1",
            mode: "image",
            prompt: "山谷中的石桥，薄雾清晨",
            createdAt: "2026-03-26T10:00:00.000Z",
            assetUrl: "/demo.png",
          },
        ]}
        onReuse={handleReuse}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /复用 prompt/i }));
    expect(handleReuse).toHaveBeenCalledWith("山谷中的石桥，薄雾清晨");
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/components/workbench/history-list.test.tsx`
Expected: FAIL because HistoryList does not exist yet

- [ ] **Step 3: 实现历史记录组件**

```tsx
// src/components/workbench/history-list.tsx
import type { HistoryItem } from "@/src/types/workbench";

type HistoryListProps = {
  items: HistoryItem[];
  onReuse: (prompt: string) => void;
};

export function HistoryList({ items, onReuse }: HistoryListProps) {
  if (items.length === 0) {
    return <p>本次会话还没有生成记录</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <p>{item.prompt}</p>
          <button type="button" onClick={() => onReuse(item.prompt)}>
            复用 prompt
          </button>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- src/components/workbench/history-list.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx src/components/workbench/history-list.tsx src/components/workbench/history-list.test.tsx
git commit -m "feat: add generation history reuse"
```

### Task 7: 实现图片生成 API Route

**Files:**
- Create: `app/api/generate-image/route.ts`
- Create: `src/server/openai-client.ts`
- Create: `src/server/normalize-image-response.ts`
- Test: `app/api/generate-image/route.test.ts`

- [ ] **Step 1: 写图片接口成功测试**

```ts
import { POST } from "./route";

describe("POST /api/generate-image", () => {
  it("returns a normalized image payload", async () => {
    const request = new Request("http://localhost/api/generate-image", {
      method: "POST",
      body: JSON.stringify({
        prompt: "青苔庭院里的木质长椅",
        options: { size: "1024x1024", quality: "standard", count: 1, style: "natural" },
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.mode).toBe("image");
    expect(json.data.assetUrl).toBeDefined();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/api/generate-image/route.test.ts`
Expected: FAIL because the route and client modules do not exist yet

- [ ] **Step 3: 实现图片生成服务端路由**

```ts
// src/server/openai-client.ts
import OpenAI from "openai";

export function createOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
```

```ts
// src/server/normalize-image-response.ts
export function normalizeImageResponse(result: { url?: string }) {
  return {
    mode: "image" as const,
    assetUrl: result.url ?? "",
  };
}
```

```ts
// app/api/generate-image/route.ts
import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/src/server/openai-client";
import { normalizeImageResponse } from "@/src/server/normalize-image-response";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.prompt) {
    return NextResponse.json({ error: { message: "prompt 不能为空" } }, { status: 400 });
  }

  const client = createOpenAIClient();
  const response = await client.images.generate({
    model: "gpt-image-1",
    prompt: body.prompt,
    size: body.options.size,
    quality: body.options.quality,
  });

  return NextResponse.json({
    data: normalizeImageResponse({ url: response.data[0]?.url }),
  });
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/api/generate-image/route.test.ts`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/api/generate-image/route.ts app/api/generate-image/route.test.ts src/server/openai-client.ts src/server/normalize-image-response.ts
git commit -m "feat: add image generation route"
```

### Task 8: 实现视频生成 API Route

**Files:**
- Create: `app/api/generate-video/route.ts`
- Create: `src/server/normalize-video-response.ts`
- Test: `app/api/generate-video/route.test.ts`

- [ ] **Step 1: 写视频接口成功测试**

```ts
import { POST } from "./route";

describe("POST /api/generate-video", () => {
  it("returns a normalized video payload", async () => {
    const request = new Request("http://localhost/api/generate-video", {
      method: "POST",
      body: JSON.stringify({
        prompt: "风吹过稻田的航拍镜头",
        options: { duration: "5s", aspectRatio: "16:9", resolution: "720p", motion: "gentle" },
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.mode).toBe("video");
    expect(json.data.assetUrl).toBeDefined();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/api/generate-video/route.test.ts`
Expected: FAIL because the route and response normalization do not exist yet

- [ ] **Step 3: 实现视频生成服务端路由**

```ts
// src/server/normalize-video-response.ts
export function normalizeVideoResponse(result: { url?: string; thumbnailUrl?: string }) {
  return {
    mode: "video" as const,
    assetUrl: result.url ?? "",
    thumbnailUrl: result.thumbnailUrl,
  };
}
```

```ts
// app/api/generate-video/route.ts
import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/src/server/openai-client";
import { normalizeVideoResponse } from "@/src/server/normalize-video-response";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.prompt) {
    return NextResponse.json({ error: { message: "prompt 不能为空" } }, { status: 400 });
  }

  const client = createOpenAIClient();
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "user",
        content: [{ type: "input_text", text: body.prompt }],
      },
    ],
  });

  return NextResponse.json({
    data: normalizeVideoResponse({ url: response.output_text }),
  });
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/api/generate-video/route.test.ts`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/api/generate-video/route.ts app/api/generate-video/route.test.ts src/server/normalize-video-response.ts
git commit -m "feat: add video generation route"
```

### Task 9: 串联前端提交逻辑与统一请求状态

**Files:**
- Create: `src/lib/request.ts`
- Modify: `app/page.tsx`
- Test: `app/page.submit.test.tsx`

- [ ] **Step 1: 写提交行为测试**

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "./page";

describe("page submit", () => {
  it("submits to image route in image mode", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { mode: "image", assetUrl: "/result.png" } }),
    }) as Mock;

    render(<HomePage />);
    fireEvent.change(screen.getByLabelText("创作描述"), { target: { value: "山间溪流与蕨类植物" } });
    fireEvent.click(screen.getByRole("button", { name: "开始生成图片" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/generate-image",
        expect.objectContaining({ method: "POST" }),
      ),
    );
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/page.submit.test.tsx`
Expected: FAIL because the submit action and request helper do not exist yet

- [ ] **Step 3: 实现提交逻辑**

```ts
// src/lib/request.ts
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error?.message ?? "请求失败");
  }

  return json as T;
}
```

```tsx
// app/page.tsx
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
} catch (error) {
  setError(error instanceof Error ? error.message : "生成失败，请重试");
  setStatus("error");
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/page.submit.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx app/page.submit.test.tsx src/lib/request.ts
git commit -m "feat: wire workbench submit flow"
```

### Task 10: 完成简约自然风格与响应式布局

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page.tsx`
- Modify: `src/components/workbench/prompt-composer.tsx`
- Modify: `src/components/workbench/mode-switch.tsx`
- Modify: `src/components/workbench/image-options-panel.tsx`
- Modify: `src/components/workbench/video-options-panel.tsx`
- Modify: `src/components/workbench/options-shell.tsx`
- Modify: `src/components/workbench/result-panel.tsx`
- Modify: `src/components/workbench/history-list.tsx`
- Test: `app/page.layout.test.tsx`

- [ ] **Step 1: 写关键视觉结构测试**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("page layout", () => {
  it("renders hero, composer, workbench and history sections", () => {
    render(<HomePage />);
    expect(screen.getByText("一个 prompt，切换图片与视频创作")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "创作工作台" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "历史记录" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/page.layout.test.tsx`
Expected: FAIL because the structured sections and final copy do not exist yet

- [ ] **Step 3: 实现最终页面样式**

```css
:root {
  --bg: #f3efe6;
  --panel: rgba(255, 252, 246, 0.82);
  --panel-strong: #fcfaf5;
  --text: #2f3426;
  --muted: #66705a;
  --line: rgba(89, 102, 74, 0.16);
  --accent: #5f7452;
  --accent-strong: #46593d;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(190, 205, 176, 0.22), transparent 28%),
    radial-gradient(circle at right center, rgba(220, 210, 190, 0.16), transparent 24%),
    var(--bg);
}
```

```tsx
<section>
  <p>自然风格创作台</p>
  <h1>生成图像与视频</h1>
  <p>一个 prompt，切换图片与视频创作</p>
</section>
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/page.layout.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/globals.css app/page.tsx src/components/workbench
git commit -m "feat: add natural workbench styling"
```

### Task 11: 补齐服务端错误兜底与环境变量说明

**Files:**
- Modify: `app/api/generate-image/route.ts`
- Modify: `app/api/generate-video/route.ts`
- Modify: `.env.example`
- Create: `README.md`
- Test: `app/api/error-handling.test.ts`

- [ ] **Step 1: 写错误响应测试**

```ts
import { POST as postImage } from "./generate-image/route";

describe("api error handling", () => {
  it("returns 400 when prompt is missing", async () => {
    const request = new Request("http://localhost/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt: "" }),
    });

    const response = await postImage(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.message).toBe("prompt 不能为空");
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/api/error-handling.test.ts`
Expected: FAIL because error-handling coverage is incomplete

- [ ] **Step 3: 实现统一错误返回并补充文档**

```ts
// app/api/generate-image/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.prompt) {
      return NextResponse.json({ error: { message: "prompt 不能为空" } }, { status: 400 });
    }

    const client = createOpenAIClient();
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: body.prompt,
      size: body.options.size,
      quality: body.options.quality,
    });

    return NextResponse.json({
      data: normalizeImageResponse({ url: response.data[0]?.url }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "服务暂时不可用",
        },
      },
      { status: 500 },
    );
  }
}
```

```env
# .env.example
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=
```

```md
# 图片与视频生成工作台

## 运行

1. 安装依赖：`npm install`
2. 配置环境变量：复制 `.env.example` 为 `.env.local`
3. 启动开发环境：`npm run dev`
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/api/error-handling.test.ts`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/api/generate-image/route.ts app/api/generate-video/route.ts app/api/error-handling.test.ts .env.example README.md
git commit -m "feat: add api error handling and setup docs"
```

### Task 12: 运行全量验证

**Files:**
- Modify: none
- Test: `app/**/*.test.ts*`
- Test: `src/**/*.test.ts*`

- [ ] **Step 1: 运行单元测试**

Run: `npm test`
Expected: PASS with all test suites green

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`
Expected: PASS with successful Next.js production build

- [ ] **Step 3: 手动检查页面**

Run: `npm run dev`
Expected: 首页可打开，默认图片模式正常，切换视频模式正常，调用失败时有错误提示

- [ ] **Step 4: 记录验证结果**

```md
- Automated tests: pass
- Build: pass
- Manual smoke check: pass
```

- [ ] **Step 5: 提交最终结果**

```bash
git add .
git commit -m "feat: complete image and video generation workbench"
```

### Task 13: 改造为横向工作台并增强移动端体验

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `src/components/workbench/prompt-composer.tsx`
- Modify: `src/components/workbench/history-list.tsx`
- Modify: `src/components/workbench/video-options-panel.tsx`
- Test: `app/page.layout.test.tsx`
- Test: `src/components/workbench/history-list.test.tsx`

- [ ] **Step 1: 先写布局与历史链接测试**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("horizontal workbench", () => {
  it("renders side by side workbench regions", () => {
    render(<HomePage />);
    expect(screen.getByRole("region", { name: "参数与提交" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "当前结果" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "历史记录" })).toBeInTheDocument();
  });
});
```

```tsx
import { render, screen } from "@testing-library/react";
import { HistoryList } from "./history-list";

describe("history list", () => {
  it("renders clickable asset link", () => {
    render(
      <HistoryList
        items={[
          {
            id: "1",
            mode: "image",
            prompt: "溪流",
            createdAt: "2026-03-26T10:00:00.000Z",
            assetUrl: "https://example.com/demo.png",
          },
        ]}
        onReuse={() => {}}
      />,
    );

    expect(screen.getByRole("link", { name: "查看资源" })).toHaveAttribute(
      "href",
      "https://example.com/demo.png",
    );
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- app/page.layout.test.tsx src/components/workbench/history-list.test.tsx`
Expected: FAIL because current layout is vertical and history does not render direct asset links

- [ ] **Step 3: 实现横向工作台与输入区重设计**

```tsx
<section className="workbench-carousel" aria-label="横向工作台">
  <section className="workspace-card" aria-label="参数与提交">...</section>
  <section className="workspace-card" aria-label="当前结果">...</section>
  <section className="workspace-card" aria-label="历史记录">...</section>
</section>
```

```tsx
<a href={item.assetUrl} target="_blank" rel="noreferrer">
  查看资源
</a>
```

```tsx
<p>视频固定生成 8 秒</p>
```

```css
.workbench-carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(320px, 1fr);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.workspace-card {
  scroll-snap-align: start;
}
```

- [ ] **Step 4: 再次运行测试并确认通过**

Run: `npm test -- app/page.layout.test.tsx src/components/workbench/history-list.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交当前任务**

```bash
git add app/page.tsx app/globals.css src/components/workbench/prompt-composer.tsx src/components/workbench/history-list.tsx src/components/workbench/video-options-panel.tsx app/page.layout.test.tsx src/components/workbench/history-list.test.tsx
git commit -m "feat: add horizontal workbench layout"
```
