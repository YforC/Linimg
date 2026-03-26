import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { createOpenAIClient } from "@/src/server/openai-client";

vi.mock("@/src/server/openai-client", () => ({
  createOpenAIClient: vi.fn(),
}));

describe("POST /api/generate-image", () => {
  beforeEach(() => {
    vi.mocked(createOpenAIClient).mockReset();
  });

  it("returns a normalized image payload", async () => {
    vi.mocked(createOpenAIClient).mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: "https://example.com/generated.png",
                },
              },
            ],
          }),
        },
      },
    } as never);

    const request = new Request("http://localhost/api/generate-image", {
      method: "POST",
      body: JSON.stringify({
        prompt: "青苔庭院里的木质长椅",
        options: { size: "1024x1024", quality: "standard", count: 1, style: "natural" },
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.mode).toBe("image");
    expect(json.data.assetUrl).toBe("https://example.com/generated.png");
  });
});
