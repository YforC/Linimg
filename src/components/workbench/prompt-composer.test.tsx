import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("prompt composer", () => {
  it("keeps prompt when switching modes", () => {
    render(<HomePage />);

    fireEvent.change(screen.getByLabelText("创作描述"), {
      target: { value: "薄雾森林里的木屋，清晨光线" },
    });
    fireEvent.click(screen.getByRole("button", { name: "生成视频" }));

    expect(screen.getByDisplayValue("薄雾森林里的木屋，清晨光线")).toBeInTheDocument();
  });

  it("does not render example prompt chips", () => {
    render(<HomePage />);

    expect(screen.queryByLabelText("参考提示词")).not.toBeInTheDocument();
  });
});
