import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const KEY = "hm.selectedSites";

type Ctx = {
  selectedIds: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const ItineraryCtx = createContext<Ctx | null>(null);

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSelectedIds(JSON.parse(raw) as string[]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const persist = (next: string[]) => {
    setSelectedIds(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  };

  const value: Ctx = {
    selectedIds,
    has: (id) => selectedIds.includes(id),
    add: (id) => !selectedIds.includes(id) && persist([...selectedIds, id]),
    remove: (id) => persist(selectedIds.filter((s) => s !== id)),
    toggle: (id) =>
      persist(
        selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id],
      ),
    clear: () => persist([]),
  };

  return <ItineraryCtx.Provider value={value}>{children}</ItineraryCtx.Provider>;
}

export function useItinerary() {
  const ctx = useContext(ItineraryCtx);
  if (!ctx) throw new Error("useItinerary must be used inside ItineraryProvider");
  return ctx;
}
