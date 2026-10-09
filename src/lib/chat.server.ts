// Server-only: Lovable AI Gateway chat for the TechPath Assistant.
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

function createRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
  };
}

const SYSTEM_PROMPT = `You are "TechPath Assistant" (مساعد مَساري التقني), a friendly AI mentor inside TechPath — an app that guides Computer Science students toward a career path in one of four fields: Artificial Intelligence, Web Development, Cybersecurity, or Data Science.

Rules:
- Answer the user's actual question directly and helpfully. Be concise (2–6 short paragraphs max, prefer fewer).
- Reply entirely in the language the user writes in (Arabic or English). If they mix, follow the dominant language.
- Stay on topic: tech careers, learning paths, skills, tools, projects, interviews, and study advice. Politely redirect off-topic questions.
- When relevant, suggest taking the in-app assessment or the AI Career Path Advisor to get a personalized roadmap.
- Use simple, encouraging language. No markdown headers; short bullet lists are fine.`;

export async function answerChat(
  request: Request,
  history: { role: "user" | "model"; text: string }[],
): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured on the server.");

  const messages: ModelMessage[] = history
    .filter((m) => m.text.trim().length > 0)
    .slice(-12)
    .map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text }));

  const runIdFetch = createRunIdFetch(
    request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined,
  );
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: SYSTEM_PROMPT,
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = await result.text;
  return text.trim();
}
