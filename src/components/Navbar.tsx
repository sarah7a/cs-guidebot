import { Link } from "@tanstack/react-router";
import { Languages, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)] transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-bold tracking-tight">{t("appName")}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">{t("navHome")}</Link>
          <Link to="/assessment" className="transition-colors hover:text-foreground">{t("navAssess")}</Link>
        </nav>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="gap-2"
        >
          <Languages className="h-4 w-4" />
          {lang === "en" ? "العربية" : "English"}
        </Button>
      </div>
    </header>
  );
}