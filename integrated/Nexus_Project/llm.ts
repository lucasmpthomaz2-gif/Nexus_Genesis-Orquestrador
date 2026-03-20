import { OpenAI } from "openai";

const client = new OpenAI();

export async function invokeLLM(payload: any) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: payload.messages,
      response_format: payload.response_format,
    });
    return response;
  } catch (error) {
    console.error("[LLM] Error invoking LLM:", error);
    throw error;
  }
}
