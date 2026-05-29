import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Shield, Lock, Loader2, Sparkles } from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";
import { fetchJson } from "@/lib/http";
import { useAuthSession } from "@/hooks/use-auth-session";

type LoginResponse = {
  ok: true;
  user: { username: string; role: "admin" | "viewer" };
  session: { username: string; role: "admin" | "viewer"; issuedAt: number; expiresAt: number };
  redirectTo: "/dashboard" | "/vault";
};

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: `Access Portal | ${BRAND_NAME}` },
      {
        name: "description",
        content:
          "Internal access portal for IP Protection secure media and distribution operations.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const { ready, session, setSession } = useAuthSession();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the browser already has a sessionStorage entry, we skip the login form
    // and route the user straight to the correct workspace.
    if (ready && session) {
      router.replace(session.role === "admin" ? "/dashboard" : "/vault");
    }
  }, [ready, router, session]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await fetchJson<LoginResponse>("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      setSession(result.session);
      router.replace(result.redirectTo);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute -top-28 left-1/2 h-[440px] w-[920px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(255,107,0,0.13),_transparent_30%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Internal access portal
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Sign in to the <span className="text-primary text-glow">secure media vault</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {BRAND_NAME} protects confidential media distribution, internal review assets, and
            future cloud-ready storage workflows with lightweight local authentication.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: "bcryptjs", label: "password hashing" },
              { value: "sessionStorage", label: "tab-scoped session" },
              { value: "middleware", label: "route protection" },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl border border-border p-4">
                <div className="font-display text-xl font-semibold text-foreground">{item.value}</div>
                <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="glass-card glow-orange lg:col-span-5 lg:col-start-8 rounded-3xl border border-border p-5 shadow-[0_30px_120px_-40px_rgba(255,107,0,0.45)]"
        >
          <div className="rounded-2xl border border-border bg-background/70 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold">{BRAND_NAME}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Secure access required
                </div>
              </div>
            </div>

            <form className="mt-8 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Username
                </label>
                <div className="mt-2 rounded-xl border border-border bg-card/60 px-4 py-3">
                  <input
                    value={form.username}
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    autoComplete="username"
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3">
                  <Lock className="h-4 w-4 shrink-0 text-primary" />
                  <input
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !ready}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {isSubmitting ? "Verifying credentials..." : "Enter Vault"}
              </button>
            </form>

            <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono uppercase tracking-wider">Session strategy</span>
                <span className="font-mono uppercase tracking-wider text-primary">sessionStorage</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono uppercase tracking-wider">Transport security</span>
                <span className="font-mono uppercase tracking-wider text-primary">signed cookie</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono uppercase tracking-wider">Roles</span>
                <span className="font-mono uppercase tracking-wider text-primary">admin / viewer</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
