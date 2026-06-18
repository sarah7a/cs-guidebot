import type { Field, Lang } from "./i18n";

const MODEL = "gemini-2.0-flash";
const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`;

function getKey(): string | null {
  const k = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  return k && k.length > 0 ? k : null;
}

export function hasGeminiKey(): boolean {
  return getKey() !== null;
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

async function callGemini(prompt: string, opts?: { json?: boolean; system?: string }): Promise<string> {
  const key = getKey();
  if (!key) throw new Error("MISSING_KEY");

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      ...(opts?.json ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (opts?.system) {
    body.systemInstruction = { parts: [{ text: opts.system }] };
  }

  const res = await fetch(ENDPOINT(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini error ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return text.trim();
}

function extractJson<T>(raw: string): T {
  let s = raw.trim();
  // strip markdown code fences if present
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  const first = s.indexOf("{");
  const firstA = s.indexOf("[");
  let start = -1;
  if (first === -1) start = firstA;
  else if (firstA === -1) start = first;
  else start = Math.min(first, firstA);
  if (start > 0) s = s.slice(start);
  return JSON.parse(s) as T;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

const FIELD_NAME: Record<Field, string> = {
  ai: "Artificial Intelligence / Machine Learning",
  web: "Web Development",
  cyber: "Cybersecurity",
  data: "Data Science",
};

export async function generateQuiz(field: Field, lang: Lang): Promise<QuizQuestion[]> {
  const langName = lang === "ar" ? "Arabic" : "English";
  const prompt = `You are an expert CS career assessor. Generate exactly 5 multiple-choice questions to evaluate a student's level in ${FIELD_NAME[field]}.
Questions should range from beginner to advanced. Each has 4 options and exactly one correct answer.
Write ALL text (question, options, explanation) in ${langName}.
Return ONLY a JSON array of 5 objects, with this exact shape:
[{"q":"...","options":["a","b","c","d"],"answerIndex":0,"explanation":"..."}]`;
  const raw = await callGemini(prompt, { json: true });
  const arr = extractJson<QuizQuestion[]>(raw);
  return arr.slice(0, 5);
}

export interface RoadmapStep {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  resources: { title: string; url: string }[];
}

export interface Roadmap {
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  steps: RoadmapStep[];
}

export async function generateRoadmap(
  field: Field,
  lang: Lang,
  score: number,
  total: number,
  wrongTopics: string[],
): Promise<Roadmap> {
  const langName = lang === "ar" ? "Arabic" : "English";
  const prompt = `You are a senior CS career mentor. A student took an assessment in ${FIELD_NAME[field]} and scored ${score}/${total}.
Topics they struggled with: ${wrongTopics.join("; ") || "none specifically"}.
Determine their level (Beginner if <2, Intermediate if 2-3, Advanced if >=4) and build a customized step-by-step learning roadmap with 5-7 steps tailored to fill their skill gaps.
Each step must have a title, duration (e.g. "2 weeks"), short description, 3-5 key skills, and 2-3 real high-quality resource links (use real, well-known URLs: official docs, freeCodeCamp, Coursera, MDN, Kaggle, fast.ai, Cybrary, TryHackMe, etc. — never invented URLs).
Write ALL human-readable text in ${langName} (keep URLs as-is). Keep level value as one of: "Beginner","Intermediate","Advanced" (English).
Return ONLY valid JSON with shape:
{"level":"Beginner|Intermediate|Advanced","summary":"...","steps":[{"title":"...","duration":"...","description":"...","skills":["..."],"resources":[{"title":"...","url":"https://..."}]}]}`;
  const raw = await callGemini(prompt, { json: true });
  return extractJson<Roadmap>(raw);
}

export async function chat(history: { role: "user" | "model"; text: string }[], lang: Lang): Promise<string> {
  const langName = lang === "ar" ? "Arabic" : "English";
  const system = `You are "TechPath Assistant", a friendly, encouraging mentor for Computer Science students. Give concise, practical guidance about CS careers, learning paths, and skills. Reply in ${langName}.`;
  const key = getKey();
  if (!key) throw new Error("MISSING_KEY");
  const res = await fetch(ENDPOINT(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      generationConfig: { temperature: 0.8 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = (await res.json()) as GeminiResponse;
  return (data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "").trim();
}