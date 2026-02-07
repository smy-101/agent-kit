import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { createOpenAI } from "@ai-sdk/openai";
import z from 'zod';

export const runtime = "nodejs"; // 先用 node 更稳（第三方兼容性也更好）

const openai = createOpenAI({
  apiKey: process.env.OTHER_API_KEY,          // 第三方平台的 key
  baseURL: "https://api-inference.modelscope.cn/v1",          // 第三方 OpenAI 兼容地址（通常以 /v1 结尾）
  // headers: { "X-Foo": "bar" },             // 若对方需要额外头
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // ModelScope 的 OpenAI 兼容网关通常只实现了 Chat Completions；
    // AI SDK 默认可能会走 /v1/responses（OpenAI Responses API），从而在这里 404。
    // model: openai.chat("moonshotai/Kimi-K2.5"),
    model: openai.chat("deepseek-ai/DeepSeek-V3.2"),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
    onStepFinish: ({ toolResults }) => {
      console.log(toolResults);
    },
  });

  return result.toUIMessageStreamResponse();
}
