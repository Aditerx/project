import { motion } from "motion/react";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { Shield, Loader2 } from "lucide-react";

import { useAuthSession } from "@/hooks/use-auth-session";
import type { UserRole } from "@/lib/session";

function SecureFallback({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute -top-28 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative glass-card glow-orange w-full max-w-md rounded-3xl p-8 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Verifying access
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SecureGate({
  role = "viewer",
  children,
  redirectTo = "/login",
}: {
  role?: UserRole;
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { ready, session } = useAuthSession();

  useEffect(() => {
    if (!ready) return;

    // We always validate the browser-side session after mount. Middleware keeps
    // unauthenticated requests out of the route in the first place, and this
    // client guard removes any stale UI if the sessionStorage copy disappears.
    if (!session) {
      router.replace(`${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (role === "admin" && session.role !== "admin") {
      router.replace("/vault?error=role");
    }
  }, [ready, role, router, session, redirectTo]);

  if (!ready || !session || (role === "admin" && session.role !== "admin")) {
    return (
      <SecureFallback
        title="Secure access required"
        description="This internal workspace is protected. Please sign in with a valid account to continue."
      />
    );
  }

  return children;
}

