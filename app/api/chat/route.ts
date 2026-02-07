import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { createOpenAI } from "@ai-sdk/openai";
import z from 'zod';

export const runtime = "nodejs";

// Request validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    parts: z.array(z.any())
  }))
});

const openai = createOpenAI({
  apiKey: process.env.OTHER_API_KEY,
  baseURL: "https://api-inference.modelscope.cn/v1",
});

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json();
    const { messages } = ChatRequestSchema.parse(body);

    const result = streamText({
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
        if (process.env.NODE_ENV === 'development') {
          console.log('Tool results:', toolResults);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request', issues: error.issues }, 
        { status: 400 }
      );
    }
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
