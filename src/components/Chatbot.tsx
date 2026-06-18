import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chat, hasGeminiKey } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "model"; text: string }

export function Chatbot() {
  const { t, lang, dir } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "model", text: t("chatWelcome") }]);
  }, [lang, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      if (!hasGeminiKey()) {
        setMessages((m) => [...m, { role: "model", text: t("errorMissingKey") }]);
      } else {
        const reply = await chat(next, lang);
        setMessages((m) => [...m, { role: "model", text: reply || "…" }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "model", text: t("errorTitle") + ": " + (e as Error).message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("chatTitle")}
        className={cn(
          "fixed bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-110",
          dir === "rtl" ? "left-6" : "right-6",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          className={cn(
            "fixed bottom-24 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)] animate-scale-in",
            dir === "rtl" ? "left-6" : "right-6",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border/60 bg-[image:var(--gradient-primary)] px-4 py-3 text-primary-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{t("chatTitle")}</div>
              <div className="text-xs opacity-80">{t("poweredBy")}</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ms-auto bg-primary text-primary-foreground"
                    : "me-auto bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="me-auto rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                {t("thinking")}
              </div>
            )}
          </div>

          <div className="border-t border-border/60 p-3">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}