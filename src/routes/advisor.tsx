import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2, Sparkles, Brain, Code, Shield, Database, RefreshCw } from "lucide-react";
import { useI18n, type Field } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Career Path Advisor — TechPath" },
      { name: "description", content: "Answer 3 quick questions and let our AI agent recommend the best tech career path for you." },
    ],
  }),
  component: AdvisorPage,
});

type Q = {
  q: { en: string; ar: string };
  options: { en: string; ar: string; field: Field }[];
};

const QUESTIONS: Q[] = [
  {
    q: {
      en: "Which activity sounds most exciting to you?",
      ar: "أي من هذه الأنشطة يثير اهتمامك أكثر؟",
    },
    options: [
      { en: "Analyzing data and discovering patterns in numbers", ar: "تحليل البيانات واكتشاف الأنماط في الأرقام", field: "data" },
      { en: "Designing beautiful, interactive websites and apps", ar: "تصميم مواقع وتطبيقات جميلة وتفاعلية", field: "web" },
      { en: "Protecting systems and hunting security vulnerabilities", ar: "حماية الأنظمة واكتشاف الثغرات الأمنية", field: "cyber" },
      { en: "Teaching machines to think and make predictions", ar: "تعليم الآلات التفكير والتنبؤ", field: "ai" },
    ],
  },
  {
    q: {
      en: "How do you prefer to solve problems?",
      ar: "كيف تفضّل حل المشكلات؟",
    },
    options: [
      { en: "With statistics, charts and clear evidence", ar: "بالإحصاء والرسوم البيانية والأدلة الواضحة", field: "data" },
      { en: "By building something visual I can click and use", ar: "ببناء شيء مرئي يمكنني التفاعل معه", field: "web" },
      { en: "By thinking like an attacker to find weaknesses", ar: "بالتفكير كمهاجم لاكتشاف نقاط الضعف", field: "cyber" },
      { en: "By training a model and letting it learn from examples", ar: "بتدريب نموذج وتركه يتعلّم من الأمثلة", field: "ai" },
    ],
  },
  {
    q: {
      en: "What kind of impact do you want your work to have?",
      ar: "ما نوع الأثر الذي تريد أن يحدثه عملك؟",
    },
    options: [
      { en: "Help businesses make smarter decisions with data", ar: "مساعدة الشركات على اتخاذ قرارات أذكى بالبيانات", field: "data" },
      { en: "Create products millions of people use every day", ar: "إنشاء منتجات يستخدمها ملايين الناس يومياً", field: "web" },
      { en: "Keep people, companies and data safe online", ar: "حماية الأشخاص والشركات والبيانات على الإنترنت", field: "cyber" },
      { en: "Push the future of intelligent automation", ar: "دفع مستقبل الأتمتة الذكية", field: "ai" },
    ],
  },
];

const FIELD_ICON: Record<Field, typeof Brain> = {
  ai: Brain,
  web: Code,
  cyber: Shield,
  data: Database,
};

function AdvisorPage() {
  const { t, lang, dir } = useI18n();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Field[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Field | null>(null);

  const choose = (f: Field) => {
    const next = [...picks, f];
    setPicks(next);
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      const counts: Record<Field, number> = { ai: 0, web: 0, cyber: 0, data: 0 };
      next.forEach((x, i) => {
        // Weight first answer slightly more; last answer (impact) slightly more too.
        const w = i === 0 ? 1.1 : i === next.length - 1 ? 1.2 : 1;
        counts[x] += w;
      });
      const winner = (Object.keys(counts) as Field[]).reduce((a, b) =>
        counts[a] >= counts[b] ? a : b,
      );
      setResult(winner);
      setAnalyzing(false);
    }, 900);
  };

  const reset = () => {
    setIndex(0);
    setPicks([]);
    setResult(null);
  };

  if (analyzing) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t("advisorAnalyzing")}</p>
      </main>
    );
  }

  if (result) {
    const Icon = FIELD_ICON[result];
    const fieldLabel = t(`field_${result}` as never);
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Icon className="h-10 w-10" />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          {t("advisorTitle")}
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {t("advisorResultIntro")}{" "}
          <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            {fieldLabel}
          </span>{" "}
          {t("advisorResultSuffix")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t(`field_${result}_desc` as never)}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate({ to: "/assessment", search: { field: result } })}
            className="h-12 gap-2 bg-[image:var(--gradient-primary)] px-6 text-base text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            {t("advisorStartQuiz")}
            <ArrowRight className={dir === "rtl" ? "h-5 w-5 rotate-180" : "h-5 w-5"} />
          </Button>
          <Button size="lg" variant="outline" onClick={reset} className="h-12 gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("advisorRetake")}
          </Button>
        </div>
      </main>
    );
  }

  const cur = QUESTIONS[index];
  const progress = ((index) / QUESTIONS.length) * 100;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t("advisorTitle")}
        </div>
        <p className="text-muted-foreground">{t("advisorDesc")}</p>
      </header>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("question")} {index + 1} {t("of")} {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={index} className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur animate-fade-in sm:p-8">
        <h2 className="text-xl font-semibold leading-relaxed sm:text-2xl">{cur.q[lang]}</h2>
        <div className="mt-6 space-y-3">
          {cur.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => choose(opt.field)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 p-4 text-start transition-all",
                "hover:border-primary/40 hover:bg-card hover:-translate-y-0.5",
              )}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-xs text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm sm:text-base">{opt[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <Link to="/assessment" className="text-muted-foreground underline-offset-4 hover:text-accent hover:underline">
          {t("orPickManually")}
        </Link>
      </div>
    </main>
  );
}