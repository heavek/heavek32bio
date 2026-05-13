import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "Текст не может быть пустым" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Перепиши этот текст как виральный сценарий для TikTok: добавь кликбейтный заголовок, краткий текст до 150 символов, 3 подходящих эмодзи и призыв подписаться.\n\n${text}`,
      },
    ],
  });

  const result = message.content[0].type === "text" ? message.content[0].text : "";
  return Response.json({ result });
}
