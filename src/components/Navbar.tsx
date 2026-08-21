import { Link } from "@tanstack/react-router";
import { Landmark, Map as MapIcon, Route as RouteIcon } from "lucide-react";
import { languages, useLang } from "@/data/i18n";
import { activeState } from "@/data/state-config";
import { useItinerary } from "@/lib/itinerary-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const { selectedIds } = useItinerary();

  return (
    <header className="sticky top-0 z-[900] border-b border-border/70 bg-card/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="heritage-gradient flex size-10 items-center justify-center rounded-xl text-primary-foreground shadow-soft">
            <Landmark className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-secondary">{t("appName")}</span>
            <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {activeState.nameTranslations[lang]} · {t("tagline")}
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 rounded-xl bg-muted p-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-card text-secondary shadow-soft" }}
          >
            <MapIcon className="size-4" />
            <span className="hidden sm:inline">{t("navMap")}</span>
          </Link>
          <Link
            to="/planner"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-card text-secondary shadow-soft" }}
          >
            <RouteIcon className="size-4" />
            <span className="hidden sm:inline">{t("navPlanner")}</span>
            {selectedIds.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-bold text-primary-foreground">
                {selectedIds.length}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-1 rounded-xl border border-border p-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                lang === l.code
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
