import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles, Brain, Code, Shield, Database, RefreshCw } from "lucide-react";
import { useI18n, type Field } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvisorDialog({ open, onOpenChange }: Props) {
  const { t, lang, dir } = useI18n();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Field[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Field | null>(null);

  const reset = () => {
    setIndex(0);
    setPicks([]);
    setResult(null);
    setAnalyzing(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

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

  const startQuiz = () => {
    if (!result) return;
    onOpenChange(false);
    navigate({ to: "/assessment", search: { field: result } });
    setTimeout(reset, 200);
  };

  const cur = QUESTIONS[index];
  const progress = (index / QUESTIONS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir={dir}
        className="max-w-xl border-border bg-[#0a0a0a]/95 p-0 backdrop-blur sm:rounded-2xl"
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="text-start">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {t("advisorTitle")}
            </div>
            <DialogTitle className="text-xl sm:text-2xl">
              {result ? t("advisorTitle") : t("advisorTitle")}
            </DialogTitle>
            <DialogDescription>{t("advisorDesc")}</DialogDescription>
          </DialogHeader>

          {analyzing && (
            <div className="flex flex-col items-center py-16 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">{t("advisorAnalyzing")}</p>
            </div>
          )}

          {!analyzing && result && (() => {
            const Icon = FIELD_ICON[result];
            const fieldLabel = t(`field_${result}` as never);
            return (
              <div className="mt-6 text-center">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold sm:text-2xl">
                  {t("advisorResultIntro")}{" "}
                  <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                    {fieldLabel}
                  </span>{" "}
                  {t("advisorResultSuffix")}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t(`field_${result}_desc` as never)}
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    size="lg"
                    onClick={startQuiz}
                    className="h-11 gap-2 bg-[image:var(--gradient-primary)] px-5 text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
                  >
                    {t("advisorStartQuiz")}
                    <ArrowRight className={dir === "rtl" ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
                  </Button>
                  <Button size="lg" variant="outline" onClick={reset} className="h-11 gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {t("advisorRetake")}
                  </Button>
                </div>
              </div>
            );
          })()}

          {!analyzing && !result && (
            <div className="mt-6">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("question")} {index + 1} {t("of")} {QUESTIONS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-[image:var(--gradient-primary)] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div key={index} className="animate-fade-in">
                <h3 className="text-base font-semibold leading-relaxed sm:text-lg">
                  {cur.q[lang]}
                </h3>
                <div className="mt-4 space-y-2.5">
                  {cur.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => choose(opt.field)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 p-3.5 text-start transition-all",
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}