import { render, screen } from "@testing-library/react";
import HomePage from "./app/page";

describe("HomePage", () => {
  it("renders the workbench heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /生成图像与视频/i })).toBeInTheDocument();
  });
});
