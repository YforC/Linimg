import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("page layout", () => {
  it("renders top tabs and a single active panel", () => {
    render(<HomePage />);

    expect(screen.getByRole("button", { name: "生成图片" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "生成视频" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "历史记录" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "主内容区" })).toBeInTheDocument();
  });
});
