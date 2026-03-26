import { describe, expect, it } from "vitest";
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
