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

    fireEvent.click(screen.getByRole("button", { name: "复用 prompt" }));

    expect(handleReuse).toHaveBeenCalledWith("山谷中的石桥，薄雾清晨");
  });

  it("renders clickable asset link", () => {
    render(
      <HistoryList
        items={[
          {
            id: "2",
            mode: "video",
            prompt: "森林中的溪流镜头",
            createdAt: "2026-03-26T10:00:00.000Z",
            assetUrl: "https://example.com/demo.mp4",
          },
        ]}
        onReuse={vi.fn()}
      />,
    );

    expect(screen.getByRole("link", { name: "查看资源" })).toHaveAttribute(
      "href",
      "https://example.com/demo.mp4",
    );
  });
});
