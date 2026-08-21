import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/data/i18n";
import { activeState } from "@/data/state-config";
import { askGuide } from "@/lib/ai.functions";
import { useChatPanel } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const { open, setOpen, siteContext } = useChatPanel();
  const { t, lang } = useLang();
  const ask = useServerFn(askGuide);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await ask({
        data: {
          language: lang,
          stateName: activeState.name,
          siteContext: siteContext ?? undefined,
          messages: next.slice(-10),
        },
      });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="heritage-gradient fixed bottom-5 right-5 z-[1200] flex size-14 items-center justify-center rounded-full text-primary-foreground shadow-card transition-transform hover:scale-105"
        aria-label={t("chatTitle")}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[1200] flex h-[min(560px,72vh)] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="heritage-gradient px-4 py-3 text-primary-foreground">
            <p className="font-display text-lg">{t("chatTitle")}</p>
            <p className="text-xs opacity-85">
              {siteContext ? siteContext.split("\n")[0] : activeState.nameTranslations[lang]}
            </p>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("chatPlaceholder")}</p>
                {[
                  "Best time to visit Ajanta Caves?",
                  "Is Kolhapur safe for solo travellers?",
                  "Which festivals happen this month?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => void send(q)}
                    className="block w-full rounded-xl border border-border bg-muted/60 px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user"
                    ? "ml-auto bg-secondary text-secondary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> …
              </div>
            )}
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !busy) void send(input.trim());
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
