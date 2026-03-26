import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "./page";

describe("page persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restores history from localStorage", async () => {
    window.localStorage.setItem(
      "img-and-veo-history",
      JSON.stringify([
        {
          id: "persisted-1",
          mode: "image",
          prompt: "持久化测试图片",
          createdAt: "2026-03-26T12:00:00.000Z",
          assetUrl: "https://example.com/persisted.png",
        },
      ]),
    );

    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "历史记录" }));

    expect(await screen.findByText("持久化测试图片")).toBeInTheDocument();
  });

  it("writes history to localStorage after generation", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "result-2",
          mode: "image",
          prompt: "写入历史记录",
          createdAt: "2026-03-26T12:00:00.000Z",
          assetUrl: "https://example.com/result.png",
        },
      }),
    }) as typeof fetch;

    render(<HomePage />);
    fireEvent.change(screen.getByLabelText("创作描述"), {
      target: { value: "写入历史记录" },
    });
    fireEvent.click(screen.getByRole("button", { name: "开始生成图片" }));

    await waitFor(() => {
      expect(window.localStorage.getItem("img-and-veo-history")).toContain("写入历史记录");
    });
  });
});
