import {
  Accessibility,
  Bookmark,
  BookmarkCheck,
  Clock,
  IndianRupee,
  Loader2,
  MessageCircleQuestion,
  Phone,
  ShieldAlert,
  Sparkles,
  Sun,
  TrainFront,
  X,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useLang } from "@/data/i18n";
import { categoryLabels, type Site } from "@/data/sites";
import { narrateStory } from "@/lib/ai.functions";
import { useChatPanel } from "@/lib/chat-store";
import { useItinerary } from "@/lib/itinerary-store";
import { cn } from "@/lib/utils";

export function SiteDetailCard({ site, onClose }: { site: Site; onClose: () => void }) {
  const { t, lang, siteName } = useLang();
  const { has, toggle } = useItinerary();
  const { openWithContext } = useChatPanel();
  const narrate = useServerFn(narrateStory);

  const [story, setStory] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inList = has(site.id);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const runNarration = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await narrate({
        data: {
          siteName: site.name,
          district: site.district,
          language: lang,
          legends: site.legendsText,
          context: site.longDescription,
        },
      });
      setStory(res.story);
      speak(res.story);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch the story.");
    } finally {
      setBusy(false);
    }
  };

  const access = t(site.accessibility.wheelchairAccess);

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-secondary/45 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-label={siteName(site)}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-card sm:rounded-3xl"
      >
        {/* header images */}
        <div className="relative h-44 shrink-0 overflow-hidden sm:h-56">
          <div className={`grid h-full gap-0.5 ${site.images.length > 1 ? "grid-cols-3" : ""}`}>
            <img
              src={site.images[0]}
              alt={site.name}
              className={`h-full w-full object-cover ${site.images.length > 1 ? "col-span-2" : ""}`}
            />
            {site.images[1] ? (
              <img
                src={site.images[1]}
                alt={`${site.name} detail`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 to-transparent p-4 pt-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-accent-foreground">
              {categoryLabels[site.category]} · {site.district}
            </span>
            <h2 className="mt-1.5 font-display text-2xl text-primary-foreground sm:text-3xl">
              {siteName(site)}
            </h2>
          </div>
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-7">
          <p className="text-base leading-relaxed text-foreground/90">{site.shortDescription}</p>

          <Section title={t("history")}>
            <p className="text-sm leading-relaxed text-foreground/85">{site.longDescription}</p>
          </Section>

          <Section title={t("culturalSignificance")}>
            <p className="text-sm leading-relaxed text-foreground/85">{site.legendsText}</p>
            <div className="mt-3 rounded-2xl border border-accent/50 bg-accent/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-display text-sm text-secondary">
                  <Sparkles className="size-4 text-primary" /> {t("storyMode")}
                </p>
                <button
                  onClick={() => void runNarration()}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground disabled:opacity-60"
                >
                  {busy && <Loader2 className="size-3.5 animate-spin" />}
                  {t("narrate")}
                </button>
              </div>
              {story && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                  {story}
                </p>
              )}
              {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
            </div>
          </Section>

          <Section title={t("practicalInfo")}>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Info icon={<Clock className="size-4" />} label={t("timings")} value={site.timings} />
              <Info
                icon={<IndianRupee className="size-4" />}
                label={t("entryFee")}
                value={site.entryFee}
              />
              <Info
                icon={<Sun className="size-4" />}
                label={t("bestTime")}
                value={site.bestTimeToVisit}
              />
              <Info
                icon={<TrainFront className="size-4" />}
                label={t("transit")}
                value={site.nearestTransit}
              />
              <Info
                icon={<Clock className="size-4" />}
                label={t("duration")}
                value={`${site.avgVisitDurationHours} ${t("hours")}`}
              />
            </dl>
          </Section>

          <Section title={t("accessSafety")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/70 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <Accessibility className="size-4" /> {t("wheelchair")}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm font-semibold",
                    site.accessibility.wheelchairAccess === "yes" && "text-primary",
                    site.accessibility.wheelchairAccess === "no" && "text-destructive",
                  )}
                >
                  {access}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{site.accessibility.notes}</p>
              </div>
              <div className="rounded-2xl bg-muted/70 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <ShieldAlert className="size-4" /> {t("advisory")}
                </p>
                <p className="mt-1 text-xs text-foreground/85">{site.safety.advisoryText}</p>
                <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-secondary">
                  <Phone className="size-3.5" /> {site.safety.emergencyContact}
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* footer actions */}
        <div className="flex shrink-0 flex-wrap gap-3 border-t border-border bg-card p-4 sm:p-5">
          <button
            onClick={() => toggle(site.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft transition-colors",
              inList
                ? "bg-muted text-secondary"
                : "heritage-gradient text-primary-foreground",
            )}
          >
            {inList ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {inList ? t("removeFromItinerary") : t("addToItinerary")}
          </button>
          <button
            onClick={() =>
              openWithContext(
                `${site.name} (${site.district} district, ${categoryLabels[site.category]})\n${site.shortDescription}\nTimings: ${site.timings}. Entry: ${site.entryFee}. Best time: ${site.bestTimeToVisit}. Accessibility: ${site.accessibility.wheelchairAccess}. Safety: ${site.safety.advisoryText}`,
              )
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-secondary px-4 py-3 text-sm font-semibold text-secondary"
          >
            <MessageCircleQuestion className="size-4" />
            {t("askAboutPlace")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-display text-lg text-secondary">{title}</h3>
      {children}
    </section>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/70 p-3.5">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground/90">{value}</dd>
    </div>
  );
}
