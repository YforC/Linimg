import { render, screen } from "@testing-library/react";
import { ResultPanel } from "./result-panel";

describe("result panel", () => {
  it("renders empty state before generation", () => {
    render(<ResultPanel status="idle" mode="image" result={null} error={null} />);

    expect(screen.getByText("输入描述后开始生成")).toBeInTheDocument();
  });

  it("renders image as non-interactive preview", () => {
    render(
      <ResultPanel
        status="success"
        mode="image"
        result={{ mode: "image", assetUrl: "https://example.com/demo.png" }}
        error={null}
      />,
    );

    expect(screen.getByAltText("生成结果")).toHaveAttribute("draggable", "false");
    expect(screen.queryByRole("link", { name: "生成结果" })).not.toBeInTheDocument();
  });
});
