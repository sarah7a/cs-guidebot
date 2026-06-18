import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Brain, Map, Bot, Sparkles, Wand2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AdvisorDialog } from "@/components/AdvisorDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechPath — AI-powered CS Career Advisor" },
      { name: "description", content: "Take an AI-driven assessment and get a personalized Computer Science roadmap. Available in Arabic and English." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, dir } = useI18n();
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const features = [
    { icon: Brain, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: Map, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: Bot, title: t("feature3Title"), desc: t("feature3Desc") },
  ];
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="flex flex-col items-center pt-20 pb-24 text-center sm:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("poweredBy")}
        </div>
        <h1 className="max-w-4xl text-balance text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            {t("appName")}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">{t("tagline")}</p>
        <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground/80">{t("heroDesc")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-12 gap-2 bg-[image:var(--gradient-primary)] px-6 text-base text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
            <Link to="/assessment">
              {t("getStarted")}
              <ArrowRight className={dir === "rtl" ? "h-5 w-5 rotate-180" : "h-5 w-5"} />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setAdvisorOpen(true)}
            className="h-12 gap-2 border-accent/40 px-6 text-base text-accent hover:bg-accent/10 hover:text-accent"
          >
            <Wand2 className="h-5 w-5" />
            {t("advisorCta")}
          </Button>
        </div>
      </section>

      <section className="grid gap-6 pb-24 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>
      <AdvisorDialog open={advisorOpen} onOpenChange={setAdvisorOpen} />
    </main>
  );
}
