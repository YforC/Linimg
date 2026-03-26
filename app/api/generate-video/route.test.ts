import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { createOpenAIClient } from "@/src/server/openai-client";

vi.mock("@/src/server/openai-client", () => ({
  createOpenAIClient: vi.fn(),
}));

describe("POST /api/generate-video", () => {
  beforeEach(() => {
    vi.mocked(createOpenAIClient).mockReset();
  });

  it("returns a normalized video payload", async () => {
    vi.mocked(createOpenAIClient).mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content:
                    '<video controls src="https://example.com/generated.mp4"></video>',
                },
              },
            ],
          }),
        },
      },
    } as never);

    const request = new Request("http://localhost/api/generate-video", {
      method: "POST",
      body: JSON.stringify({
        prompt: "风吹过稻田的航拍镜头",
        options: { duration: "5s", aspectRatio: "16:9", resolution: "720p", motion: "gentle" },
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.mode).toBe("video");
    expect(json.data.assetUrl).toBe("https://example.com/generated.mp4");
    expect(json.data.thumbnailUrl).toBeUndefined();
  });
});
