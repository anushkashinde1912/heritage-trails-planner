import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Compass, Loader2, Search } from "lucide-react";
import { lazy, useMemo, useState } from "react";
import { SiteDetailCard } from "@/components/SiteDetailCard";
import { useLang } from "@/data/i18n";
import { categoryLabels, sites, type Site, type SiteCategory } from "@/data/sites";
import { activeState, regionColorVar, type RegionKey } from "@/data/state-config";
import { cn } from "@/lib/utils";

const MapCanvas = lazy(() => import("@/components/MapCanvas"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heritage Maharashtra — Interactive Cultural Heritage Map" },
      {
        name: "description",
        content:
          "Explore Maharashtra's forts, caves, temples, festivals and craft villages on a district map, then build an AI day-wise heritage itinerary.",
      },
      { property: "og:title", content: "Heritage Maharashtra — Interactive Cultural Heritage Map" },
      {
        property: "og:description",
        content:
          "An interactive district map of Maharashtra's heritage sites with story mode, accessibility layers and AI trip planning.",
      },
    ],
  }),
  component: HomePage,
});

const categories = Object.keys(categoryLabels) as SiteCategory[];

function HomePage() {
  const { t, siteName } = useLang();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<SiteCategory[]>([]);
  const [focused, setFocused] = useState<Site | null>(null);
  const [openSite, setOpenSite] = useState<Site | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sites.filter((s) => {
      const catOk = active.length === 0 || active.includes(s.category);
      const qOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.nameTranslations.mr.includes(query.trim()) ||
        s.nameTranslations.hi.includes(query.trim()) ||
        s.district.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [query, active]);

  const select = (site: Site) => {
    setFocused(site);
    setOpenSite(site);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6">
      {/* search + filters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm shadow-soft outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActive([])}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              active.length === 0
                ? "border-secondary bg-secondary text-secondary-foreground"
                : "border-border text-muted-foreground hover:border-primary",
            )}
          >
            {t("allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() =>
                setActive((prev) =>
                  prev.includes(c) ? prev.filter((p) => p !== c) : [...prev, c],
                )
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active.includes(c)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary",
              )}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {/* map plate — the visual anchor */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-map-canvas shadow-card">
        <div className="absolute inset-y-0 left-0 z-[400] w-[22%] bg-map-band/85 max-lg:hidden" />
        <div className="h-[62vh] min-h-[420px] w-full sm:h-[72vh]">
          <ClientOnly
            fallback={
              <div className="flex h-full items-center justify-center gap-2 text-sm text-secondary">
                <Loader2 className="size-4 animate-spin" /> Loading map…
              </div>
            }
          >
            <MapCanvas visibleSites={visible} focused={focused} onSelect={select} />
          </ClientOnly>
        </div>

        {/* legend */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-[500] rounded-2xl border border-border bg-card/95 p-4 shadow-soft">
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {t("legend")}
          </p>
          <ul className="space-y-1.5">
            {(Object.keys(activeState.regionLabels) as RegionKey[]).map((r) => (
              <li key={r} className="flex items-center gap-2 text-xs text-foreground">
                <span
                  className="size-3 rounded-sm"
                  style={{ background: `var(${regionColorVar[r]})` }}
                />
                {activeState.regionLabels[r]}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute left-4 top-4 z-[500] max-w-[15rem] rounded-2xl border border-border bg-card/95 p-4 shadow-soft">
          <p className="flex items-center gap-2 font-display text-base text-secondary">
            <Compass className="size-4 text-primary" />
            {activeState.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {visible.length} {t("sitesShown")}
          </p>
        </div>
      </div>

      {/* site strip */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visible.slice(0, 8).map((s) => (
          <button
            key={s.id}
            onClick={() => select(s)}
            className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-colors hover:border-primary"
          >
            <img
              src={s.images[0]}
              alt={s.name}
              loading="lazy"
              className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="p-3.5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary">
                {categoryLabels[s.category]} · {s.district}
              </p>
              <p className="mt-1 font-display text-base text-secondary">{siteName(s)}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {s.shortDescription}
              </p>
            </div>
          </button>
        ))}
      </div>

      {openSite && <SiteDetailCard site={openSite} onClose={() => setOpenSite(null)} />}
    </div>
  );
}
