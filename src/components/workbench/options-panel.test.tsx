import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("options panels", () => {
  it("shows video fields after switching to video mode", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "生成视频" }));

    expect(screen.getByLabelText("视频时长")).toBeInTheDocument();
    expect(screen.queryByLabelText("图片尺寸")).not.toBeInTheDocument();
  });
});
