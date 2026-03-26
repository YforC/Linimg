import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "./page";

describe("page submit", () => {
  it("submits to image route in image mode", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: "result-1",
          mode: "image",
          prompt: "山间溪流与蕨类植物",
          createdAt: "2026-03-26T12:00:00.000Z",
          assetUrl: "/result.png",
        },
      }),
    }) as typeof fetch;

    render(<HomePage />);

    fireEvent.change(screen.getByLabelText("创作描述"), {
      target: { value: "山间溪流与蕨类植物" },
    });
    fireEvent.click(screen.getByRole("button", { name: "开始生成图片" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/generate-image",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
