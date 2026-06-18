import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Brain, Code, Database, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n, type Field } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { generateQuiz, generateRoadmap, hasGeminiKey, type QuizQuestion } from "@/lib/techpath-engine";
import { saveAssessment } from "@/lib/assessment-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Assessment — TechPath" },
      { name: "description", content: "Take a smart AI assessment in your chosen CS field to get a personalized roadmap." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { field?: Field } => {
    const f = search.field;
    if (f === "ai" || f === "web" || f === "cyber" || f === "data") return { field: f };
    return {};
  },
  component: AssessmentPage,
});

const FIELDS: { id: Field; icon: typeof Brain }[] = [
  { id: "ai", icon: Brain },
  { id: "web", icon: Code },
  { id: "cyber", icon: Shield },
  { id: "data", icon: Database },
];

function AssessmentPage() {
  const { t, lang, dir } = useI18n();
  const navigate = useNavigate();
  const { field: presetField } = Route.useSearch();
  const [field, setField] = useState<Field | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (presetField && !field) {
      void start(presetField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetField]);

  const start = async (f: Field) => {
    setField(f);
    setError(null);
    setIndex(0);
    setAnswers([]);
    if (!hasGeminiKey()) {
      setError(t("errorMissingKey"));
      return;
    }
    setLoading(true);
    try {
      const qs = await generateQuiz(f, lang);
      setQuestions(qs);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const choose = (i: number) => {
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
  };

  const goNext = async () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (!field) return;
    setGenerating(true);
    setError(null);
    try {
      const wrongTopics: string[] = [];
      let score = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.answerIndex) score++;
        else wrongTopics.push(q.q);
      });
      const roadmap = await generateRoadmap(field, lang, score, questions.length, wrongTopics);
      saveAssessment({ field, score, total: questions.length, wrongTopics, roadmap, lang });
      navigate({ to: "/roadmap" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  // ---------- Field picker ----------
  if (!field || (!loading && questions.length === 0 && !error)) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("pickField")}</h1>
          <p className="mt-3 text-muted-foreground">{t("pickFieldDesc")}</p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => start(id)}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-6 text-start backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold">{t(`field_${id}` as never)}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t(`field_${id}_desc` as never)}</p>
              </div>
              <ArrowRight className={cn("mt-2 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1", dir === "rtl" && "rotate-180 group-hover:-translate-x-1")} />
            </button>
          ))}
        </div>
      </main>
    );
  }

  // ---------- Error ----------
  if (error && questions.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h2 className="text-2xl font-semibold">{t("errorTitle")}</h2>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Button className="mt-6" onClick={() => field && start(field)}>{t("retry")}</Button>
      </main>
    );
  }

  // ---------- Loading quiz ----------
  if (loading) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t("loadingQuiz")}</p>
      </main>
    );
  }

  // ---------- Generating roadmap ----------
  if (generating) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t("generating")}</p>
      </main>
    );
  }

  // ---------- Quiz ----------
  const q = questions[index];
  const selected = answers[index];
  const progress = ((index + (selected != null ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("question")} {index + 1} {t("of")} {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-[image:var(--gradient-primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div key={index} className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur animate-fade-in sm:p-8">
        <h2 className="text-xl font-semibold leading-relaxed sm:text-2xl">{q.q}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt, i) => {
            const active = selected === i;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-start transition-all",
                  active
                    ? "border-primary bg-primary/10 text-foreground shadow-[var(--shadow-glow)]"
                    : "border-border bg-card/40 hover:border-primary/40 hover:bg-card",
                )}
              >
                <span className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                )}>
                  {active ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm sm:text-base">{opt}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            {t("back")}
          </Button>
          <Button
            disabled={selected == null}
            onClick={goNext}
            className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            {index === questions.length - 1 ? t("submit") : t("next")}
            <ArrowRight className={dir === "rtl" ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
    </main>
  );
}