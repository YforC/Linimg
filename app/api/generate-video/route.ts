import { NextResponse } from "next/server";
import { createOpenAIClient } from "@/src/server/openai-client";
import { extractAssetUrl } from "@/src/server/extract-asset-url";
import { normalizeVideoResponse } from "@/src/server/normalize-video-response";
import type { VideoOptions } from "@/src/types/workbench";

type VideoRequestBody = {
  prompt?: string;
  options?: Partial<VideoOptions>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VideoRequestBody;
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ error: { message: "prompt 不能为空" } }, { status: 400 });
    }

    const client = createOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gemini-veo",
      stream: false,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const content = response.choices[0]?.message?.content;
    const assetUrl = extractAssetUrl(typeof content === "string" ? content : "");

    return NextResponse.json({
      data: normalizeVideoResponse({
        prompt,
        assetUrl,
      }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "服务暂时不可用",
        },
      },
      { status: 500 },
    );
  }
}
