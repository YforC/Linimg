import { defaultImageOptions, defaultVideoOptions, workbenchModes } from "./workbench";

describe("workbench config", () => {
  it("defaults to image and video mode options", () => {
    expect(workbenchModes).toEqual(["image", "video"]);
    expect(defaultImageOptions.size).toBe("1024x1024");
    expect(defaultVideoOptions.duration).toBe("8s");
  });
});
