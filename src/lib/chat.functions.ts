import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export interface ChatMsg {
  role: "user" | "model";
  text: string;
}

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: ChatMsg[] }) => data)
  .handler(async ({ data }) => {
    const { answerChat } = await import("./chat.server");
    return answerChat(getRequest(), data.messages);
  });
