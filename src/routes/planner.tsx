import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Clock,
  Loader2,
  MapPin,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLang } from "@/data/i18n";
import { categoryLabels, sites, type Site } from "@/data/sites";
import { activeState } from "@/data/state-config";
import { generateItinerary } from "@/lib/ai.functions";
import { useItinerary } from "@/lib/itinerary-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Itinerary Planner | Heritage Maharashtra" },
      {
        name: "description",
        content:
          "Turn your selected Maharashtra forts, temples and caves into a day-wise heritage itinerary with AI, in English, Marathi or Hindi.",
      },
      { property: "og:title", content: "AI Itinerary Planner | Heritage Maharashtra" },
      {
        property: "og:description",
        content: "Day-wise heritage trip plans across Maharashtra, generated from your saved spots.",
      },
    ],
  }),
  component: PlannerPage,
});

type Itinerary = Awaited<ReturnType<typeof generateItinerary>>;

const interestOptions = ["heritage", "nature", "food", "adventure", "shopping", "spiritual"];
const budgetOptions = ["Budget (under ₹2,000/day)", "Mid-range (₹2,000–5,000/day)", "Premium (₹5,000+/day)"];
const groupOptions = ["Solo", "Family", "Friends", "Couple", "School group"];

function PlannerPage() {
  const { t, lang, siteName } = useLang();
  const { selectedIds, remove, add, has } = useItinerary();
  const run = useServerFn(generateItinerary);

  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(budgetOptions[1]!);
  const [interests, setInterests] = useState<string[]>(["heritage"]);
  const [startCity, setStartCity] = useState("Pune");
  const [groupType, setGroupType] = useState(groupOptions[1]!);
  const [query, setQuery] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  function getTimeOfDay(timeSlot: string): "morning" | "afternoon" | "evening" {
    const lower = timeSlot.toLowerCase();
    if (lower.includes("pm")) {
      const match = lower.match(/(\d+):/);
      if (match) {
        const hour = parseInt(match[1], 10);
        if (hour === 12 || hour < 4) {
          return "afternoon";
        }
      }
      return "evening";
    }
    return "morning";
  }

  const dayType = useMemo(() => {
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    return isWeekend ? "weekend" : "weekday";
  }, []);

  const crowdAlert = useMemo(() => {
    if (!itinerary) return null;

    for (const day of itinerary.days) {
      for (const stop of day.stops) {
        if (!stop.siteId) continue;

        const site = sites.find((s) => s.id === stop.siteId);
        if (site && site.crowd_pattern) {
          const timeOfDay = getTimeOfDay(stop.timeSlot);
          const crowdLevel = site.crowd_pattern[dayType][timeOfDay];

          if (crowdLevel === "high") {
            const altId = site.nearby_alternatives.find((altId) =>
              sites.some((s) => s.id === altId),
            );
            if (altId) {
              const altSite = sites.find((s) => s.id === altId);
              if (altSite) {
                const alertKey = `${day.day}-${site.id}-${altSite.id}`;
                if (!dismissedAlerts.includes(alertKey)) {
                  return {
                    key: alertKey,
                    day: day.day,
                    stop,
                    site,
                    altSite,
                  };
                }
              }
            }
          }
        }
      }
    }
    return null;
  }, [itinerary, dayType, dismissedAlerts]);

  const dismissAlert = (key: string) => {
    setDismissedAlerts((prev) => [...prev, key]);
  };

  const handleSwap = (dayNum: number, originalStopSiteId: string, altSite: Site) => {
    if (!itinerary) return;

    const updatedDays = itinerary.days.map((day) => {
      if (day.day !== dayNum) return day;

      const altStopIndex = day.stops.findIndex((s) => s.siteId === altSite.id);
      const origStopIndex = day.stops.findIndex((s) => s.siteId === originalStopSiteId);

      if (origStopIndex === -1) return day;

      let newStops = [...day.stops];

      if (altStopIndex !== -1) {
        const origStop = day.stops[origStopIndex];
        const altStop = day.stops[altStopIndex];

        const firstIdx = Math.min(origStopIndex, altStopIndex);
        const secondIdx = Math.max(origStopIndex, altStopIndex);

        newStops[firstIdx] = {
          ...altStop,
          timeSlot: day.stops[firstIdx].timeSlot,
        };
        newStops[secondIdx] = {
          ...origStop,
          timeSlot: day.stops[secondIdx].timeSlot,
        };
      } else {
        const origStop = day.stops[origStopIndex];

        const altStop = {
          siteId: altSite.id,
          name: altSite.name,
          timeSlot: origStop.timeSlot,
          durationHours: altSite.avgVisitDurationHours,
          blurb: `Visited first to avoid crowd peaks at ${origStop.name}. Discover its historical value.`,
          tip: "A quieter and more comfortable experience during peak hours.",
        };

        const updatedOrigStop = {
          ...origStop,
          timeSlot: "02:30 PM - 06:30 PM",
        };

        newStops.splice(origStopIndex, 1, altStop, updatedOrigStop);
      }

      return {
        ...day,
        stops: newStops,
      };
    });

    setItinerary({
      ...itinerary,
      days: updatedDays,
    });
  };

  const selected = useMemo(
    () => selectedIds.map((id) => sites.find((s) => s.id === id)).filter(Boolean) as Site[],
    [selectedIds],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return sites
      .filter((s) => !has(s.id))
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.category.includes(q),
      )
      .slice(0, 6);
  }, [query, has]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await run({
        data: {
          stateName: activeState.name,
          language: lang,
          days,
          budget,
          interests,
          startCity,
          groupType,
          sites: selected.map((s) => ({
            id: s.id,
            name: s.name,
            district: s.district,
            category: s.category,
            lat: s.lat,
            lng: s.lng,
            avgVisitDurationHours: s.avgVisitDurationHours,
          })),
        },
      });
      setItinerary(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the itinerary.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t("backToMap")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* ---- left column: spots + form ---- */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-xl text-secondary">
              {t("selectedSpots")}{" "}
              <span className="text-sm text-muted-foreground">({selected.length})</span>
            </h2>

            {selected.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{t("noSelection")}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {selected.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-2xl bg-muted/70 px-3 py-2.5"
                  >
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{siteName(s)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {s.district} · {categoryLabels[s.category]} · {s.avgVisitDurationHours}{" "}
                        {t("hours")}
                      </span>
                    </span>
                    <button
                      onClick={() => remove(s.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={t("removeFromItinerary")}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {suggestions.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          add(s.id);
                          setQuery("");
                        }}
                        className="w-full rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary"
                      >
                        {siteName(s)}
                        <span className="ml-2 text-xs text-muted-foreground">{s.district}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("days")}: {days}
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </div>

            <Field label={t("budget")}>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {budgetOptions.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>

            <Field label={t("interests")}>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setInterests((prev) =>
                        prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors",
                      interests.includes(i)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary",
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t("startCity")}>
              <input
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>

            <Field label={t("groupType")}>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {groupOptions.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>

            <button
              onClick={() => void submit()}
              disabled={busy || selected.length === 0}
              className="heritage-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-primary-foreground shadow-soft transition-opacity disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {busy ? t("generating") : t("planTrip")}
            </button>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </section>
        </div>

        {/* ---- right column: itinerary ---- */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-soft print:border-0 print:shadow-none sm:p-7">
          {!itinerary && !busy && (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
              <span className="heritage-gradient mb-4 flex size-14 items-center justify-center rounded-2xl text-primary-foreground">
                <Sparkles className="size-6" />
              </span>
              <h2 className="font-display text-2xl text-secondary">{t("itineraryTitle")}</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {selected.length === 0 ? t("noSelection") : t("planTrip")}
              </p>
            </div>
          )}

          {busy && !itinerary && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse space-y-2 rounded-2xl bg-muted/70 p-5">
                  <div className="h-4 w-32 rounded bg-border" />
                  <div className="h-3 w-full rounded bg-border" />
                  <div className="h-3 w-4/5 rounded bg-border" />
                </div>
              ))}
            </div>
          )}

          {itinerary && (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-secondary">{itinerary.title}</h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{itinerary.summary}</p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={() => void submit()}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary"
                  >
                    <RefreshCw className={cn("size-3.5", busy && "animate-spin")} />
                    {t("regenerate")}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary"
                  >
                    <Printer className="size-3.5" />
                    {t("print")}
                  </button>
                </div>
              </div>

              {crowdAlert && (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <span className="mt-0.5 text-lg">⚠️</span>
                      <div>
                        <h4 className="font-bold text-sm">
                          Crowd Alert: High Crowd Level Expected
                        </h4>
                        <p className="mt-1 text-xs text-amber-800">
                          {crowdAlert.site.name} is expected to be very busy during the scheduled time slot (<strong>{crowdAlert.stop.timeSlot}</strong>) on Day {crowdAlert.day}.
                          We recommend visiting <strong>{crowdAlert.altSite.name}</strong> instead to avoid the peak crowd.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(crowdAlert.key)}
                      className="text-amber-500 hover:text-amber-700 text-xs font-bold px-1"
                      aria-label="Dismiss Alert"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSwap(crowdAlert.day, crowdAlert.site.id, crowdAlert.altSite)}
                      className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-soft"
                    >
                      Swap now
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-6">
                {itinerary.days.map((day) => (
                  <article key={day.day} className="relative pl-6">
                    <span className="absolute left-0 top-2 size-3 rounded-full bg-primary ring-4 ring-primary/15" />
                    <span className="absolute bottom-0 left-[5px] top-6 w-px bg-border" />
                    <header className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Day {day.day}
                      </p>
                      <h3 className="font-display text-xl text-secondary">{day.theme}</h3>
                      <p className="text-xs text-muted-foreground">
                        Base: {day.base} · {day.travelNotes}
                      </p>
                    </header>
                    <ul className="space-y-3">
                      {day.stops.map((stop, idx) => (
                        <li
                          key={idx}
                          className="rounded-2xl border border-border bg-background/60 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-semibold text-secondary">
                              <Clock className="size-3" />
                              {stop.timeSlot}
                            </span>
                            <span className="font-semibold">{stop.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {stop.durationHours} {t("hours")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {stop.blurb}
                          </p>
                          {stop.tip && (
                            <p className="mt-1.5 text-xs italic text-muted-foreground">
                              {stop.tip}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
