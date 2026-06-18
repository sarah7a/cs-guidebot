import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type Field = "ai" | "web" | "cyber" | "data";

type Dict = Record<string, string>;

const en: Dict = {
  appName: "TechPath",
  tagline: "Your AI-powered Computer Science career advisor",
  heroDesc:
    "Discover your path in tech. Take a smart AI-driven assessment and get a personalized roadmap with curated resources to bridge your skill gaps.",
  getStarted: "Start Your Journey",
  learnMore: "Learn More",
  feature1Title: "AI Assessment",
  feature1Desc: "An intelligent agent evaluates your current level with adaptive questions.",
  feature2Title: "Custom Roadmap",
  feature2Desc: "Get a visual, step-by-step learning path tailored to your goals.",
  feature3Title: "AI Mentor",
  feature3Desc: "Chat with your TechPath Assistant for guidance anytime, anywhere.",
  pickField: "Choose your field",
  pickFieldDesc: "Select the area you want to grow in. Our AI agent will tailor everything to you.",
  field_ai: "Artificial Intelligence",
  field_ai_desc: "ML, deep learning, LLMs and applied AI.",
  field_web: "Web Development",
  field_web_desc: "Frontend, backend and full-stack engineering.",
  field_cyber: "Cybersecurity",
  field_cyber_desc: "Offensive and defensive security, networks.",
  field_data: "Data Science",
  field_data_desc: "Analytics, statistics and data engineering.",
  start: "Start",
  question: "Question",
  of: "of",
  next: "Next",
  back: "Back",
  submit: "See My Roadmap",
  generating: "Generating your personalized roadmap...",
  thinking: "Thinking...",
  yourRoadmap: "Your Personalized Roadmap",
  level: "Estimated Level",
  retake: "Retake Assessment",
  resources: "Resources",
  openResource: "Open",
  chatTitle: "TechPath Assistant",
  chatPlaceholder: "Ask anything about your tech career...",
  send: "Send",
  chatWelcome: "Hi! I'm your TechPath Assistant. How can I help you grow today?",
  loadingQuiz: "Preparing your quiz...",
  errorTitle: "Something went wrong",
  errorMissingKey: "",
  retry: "Try again",
  poweredBy: "Your built-in tech mentor",
  step: "Step",
  weeks: "weeks",
  navHome: "Home",
  navAssess: "Assessment",
  beginnerL: "Beginner",
  intermediateL: "Intermediate",
  advancedL: "Advanced",
};

const ar: Dict = {
  appName: "مَساري التقني",
  tagline: "مرشدك الذكي لمسارك المهني في علوم الحاسب",
  heroDesc:
    "اكتشف مسارك في عالم التقنية. خذ تقييماً ذكياً مدعوماً بالذكاء الاصطناعي واحصل على خارطة طريق مخصصة مع مصادر مختارة لسد الفجوات في مهاراتك.",
  getStarted: "ابدأ رحلتك",
  learnMore: "اعرف المزيد",
  feature1Title: "تقييم ذكي",
  feature1Desc: "وكيل ذكي يقيّم مستواك الحالي بأسئلة تتكيف معك.",
  feature2Title: "خارطة مخصصة",
  feature2Desc: "خارطة طريق بصرية خطوة بخطوة مصممة لأهدافك.",
  feature3Title: "مرشد بالذكاء الاصطناعي",
  feature3Desc: "تحدث مع مساعد مَساري التقني للحصول على توجيه في أي وقت.",
  pickField: "اختر مجالك",
  pickFieldDesc: "اختر المجال الذي تريد التطور فيه وسنخصص لك كل شيء.",
  field_ai: "الذكاء الاصطناعي",
  field_ai_desc: "تعلم الآلة والتعلم العميق ونماذج اللغة.",
  field_web: "تطوير الويب",
  field_web_desc: "الواجهات والخوادم والتطوير الشامل.",
  field_cyber: "الأمن السيبراني",
  field_cyber_desc: "الأمن الهجومي والدفاعي والشبكات.",
  field_data: "علم البيانات",
  field_data_desc: "التحليلات والإحصاء وهندسة البيانات.",
  start: "ابدأ",
  question: "سؤال",
  of: "من",
  next: "التالي",
  back: "السابق",
  submit: "اعرض خارطتي",
  generating: "جارٍ توليد خارطة الطريق الخاصة بك...",
  thinking: "جارٍ التفكير...",
  yourRoadmap: "خارطة طريقك المخصصة",
  level: "المستوى التقديري",
  retake: "إعادة التقييم",
  resources: "مصادر",
  openResource: "افتح",
  chatTitle: "مساعد مَساري التقني",
  chatPlaceholder: "اسأل عن أي شيء يخص مسارك التقني...",
  send: "إرسال",
  chatWelcome: "مرحباً! أنا مساعد مَساري التقني. كيف يمكنني مساعدتك اليوم؟",
  loadingQuiz: "جارٍ تجهيز اختبارك...",
  errorTitle: "حدث خطأ ما",
  errorMissingKey: "",
  retry: "حاول مرة أخرى",
  poweredBy: "مرشدك التقني المدمج",
  step: "خطوة",
  weeks: "أسابيع",
  navHome: "الرئيسية",
  navAssess: "التقييم",
  beginnerL: "مبتدئ",
  intermediateL: "متوسط",
  advancedL: "متقدم",
};

const dicts: Record<Lang, Dict> = { en, ar };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof en) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("techpath-lang")) as Lang | null;
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("techpath-lang", l);
  };

  const t = (k: keyof typeof en) => dicts[lang][k] ?? en[k] ?? String(k);

  return (
    <Ctx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export const FIELD_LABELS: Record<Field, { en: string; ar: string }> = {
  ai: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" },
  web: { en: "Web Development", ar: "تطوير الويب" },
  cyber: { en: "Cybersecurity", ar: "الأمن السيبراني" },
  data: { en: "Data Science", ar: "علم البيانات" },
};