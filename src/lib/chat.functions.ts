import { createServerFn } from "@tanstack/react-start";

export interface ChatMsg {
  role: "user" | "model";
  text: string;
}

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: ChatMsg[] }) => data)
  .handler(async ({ data, request }) => {
    const { answerChat } = await import("./chat.server");
    return answerChat(request, data.messages);
  });
