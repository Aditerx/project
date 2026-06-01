import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Shield, LogOut, LayoutDashboard, UserCircle2 } from "lucide-react";
import { useState } from "react";

import { BRAND_NAME } from "@/lib/brand";
import { fetchJson } from "@/lib/http";
import { useAuthSession } from "@/hooks/use-auth-session";

export function InternalHeader() {
  const router = useRouter();
  const { session, setSession } = useAuthSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetchJson<{ ok: true }>("/api/auth/logout", { method: "POST" });
    } catch {
      // Logout is best-effort. We still clear local session state so the UI is
      // immediately revoked even if the network is briefly unavailable.
    } finally {
      setSession(null);
      setIsLoggingOut(false);
      await router.invalidate();
      await router.navigate({ to: "/login", replace: true });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/vault" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-glow glow-orange">
            <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-bold tracking-tight">{BRAND_NAME}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Secure media vault
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <UserCircle2 className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono uppercase tracking-[0.16em]">{session?.username}</span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono uppercase tracking-wider text-primary">
              {session?.role}
            </span>
          </div>

          {session?.role === "admin" && (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
