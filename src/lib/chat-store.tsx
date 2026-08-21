import { createContext, useContext, useState, type ReactNode } from "react";

type ChatCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  siteContext: string | null;
  openWithContext: (context: string | null) => void;
};

const Ctx = createContext<ChatCtx | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [siteContext, setSiteContext] = useState<string | null>(null);

  return (
    <Ctx.Provider
      value={{
        open,
        setOpen,
        siteContext,
        openWithContext: (context) => {
          setSiteContext(context);
          setOpen(true);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useChatPanel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChatPanel must be used inside ChatProvider");
  return ctx;
}
