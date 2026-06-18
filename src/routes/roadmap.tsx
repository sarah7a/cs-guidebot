import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useI18n, FIELD_LABELS } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { loadAssessment, type AssessmentResult } from "@/lib/assessment-store";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Your Roadmap — TechPath" },
      { name: "description", content: "Your AI-generated personalized Computer Science learning roadmap." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [data, setData] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const d = loadAssessment();
    if (!d || !d.roadmap) {
      navigate({ to: "/assessment" });
      return;
    }
    setData(d);
  }, [navigate]);

  if (!data || !data.roadmap) return null;
  const { roadmap, field, score, total } = data;
  const levelLabel =
    roadmap.level === "Beginner" ? t("beginnerL") : roadmap.level === "Intermediate" ? t("intermediateL") : t("advancedL");

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="rounded-3xl border border-border bg-card/60 p-8 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-[260px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {FIELD_LABELS[field][lang]}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("yourRoadmap")}
            </h1>
            <p className="mt-3 text-muted-foreground">{roadmap.summary}</p>
          </div>
          <div className="grid min-w-[180px] grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-background/50 p-4 text-center">
              <Trophy className="mx-auto mb-1 h-5 w-5 text-accent" />
              <div className="text-2xl font-bold">{score}/{total}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("level")}</div>
              <div className="mt-1 text-lg font-semibold text-accent">{levelLabel}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/assessment"><RotateCcw className="h-4 w-4" /> {t("retake")}</Link>
          </Button>
        </div>
      </header>

      <ol className="relative mt-12 space-y-8 ps-6 sm:ps-8">
        <span aria-hidden className="absolute inset-y-0 start-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent sm:start-3" />
        {roadmap.steps.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -start-1.5 top-2 grid h-6 w-6 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)] sm:-start-0.5 sm:h-7 sm:w-7">
              {i + 1}
            </span>
            <div className="ms-6 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition-all hover:border-primary/40 sm:ms-8">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-semibold sm:text-xl">{s.title}</h3>
                <span className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground">
                  {s.duration}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{s.description}</p>
              {s.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.skills.map((sk) => (
                    <span key={sk} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
              {s.resources?.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("resources")}</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {s.resources.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm transition-colors hover:border-accent/40 hover:bg-background/70"
                      >
                        <span className="truncate">{r.title}</span>
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}