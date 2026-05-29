import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ShieldAlert, Cpu, Eye, Microscope, Cloud, AlertOctagon, Activity, ChevronRight, FileText } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionHeader, Reveal } from "../components/Section";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights | IP Protection" },
      { name: "description", content: "Threat intelligence research, ransomware trend reports, AI security, dark-web monitoring and zero-day analysis." },
    ],
  }),
  component: InsightsPage,
});

const categories = [
  { icon: ShieldAlert, t: "Threat Intelligence" },
  { icon: AlertOctagon, t: "Ransomware Trends" },
  { icon: Cpu, t: "AI Security" },
  { icon: Eye, t: "Dark Web Monitoring" },
  { icon: Microscope, t: "Incident Analysis" },
  { icon: BookOpen, t: "Security Research" },
  { icon: Cloud, t: "Cloud Security" },
  { icon: Activity, t: "Zero-Day Threats" },
];

const articles = [
  { cat: "Threat Intelligence", t: "Inside the LATAM banking trojan resurgence", d: "How a dormant family re-emerged with AI-assisted lure generation." },
  { cat: "Ransomware", t: "Q1 ransomware report: triple-extortion goes mainstream", d: "Eight new affiliate groups, faster TTPs, and the rise of leak auctions." },
  { cat: "AI Security", t: "Adversarial prompt injection in production copilots", d: "Patterns we observed across 30 enterprise deployments." },
  { cat: "Cloud", t: "S3 misconfig is back: 2026's most-exploited control gap", d: "Telemetry-backed playbook for posture remediation." },
  { cat: "Zero-Day", t: "CVE-2026-0418 deep dive: from PoC to global wave in 6 hours", d: "Timeline, IOCs and detection guidance for defenders." },
  { cat: "Dark Web", t: "The credential bazaar: pricing trends and broker economics", d: "What 12 months of monitoring tells us about access markets." },
];

function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights & Research"
        title={<>Cyber intelligence & <span className="text-primary">security insights</span>.</>}
        subtitle="Research-driven analysis, emerging threat intelligence, and strategic cybersecurity perspectives for modern enterprises."
      />

      {/* Featured */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid lg:grid-cols-12 gap-6 rounded-3xl border border-border bg-card overflow-hidden">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-[oklch(0.16_0.006_280)]">
                <div className="absolute inset-0 cyber-grid-sm opacity-40" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative w-48 h-48 rounded-full border border-primary/40">
                    <div className="absolute inset-3 rounded-full border border-primary/30" />
                    <div className="absolute inset-6 rounded-full border border-primary/20" />
                    <div className="absolute inset-0 grid place-items-center text-primary">
                      <FileText className="h-10 w-10" />
                    </div>
                  </div>
                </div>
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/80">Featured Report · 2026 H1</div>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary">Threat Intelligence</div>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight">The rise of AI-powered threat campaigns in enterprise infrastructure</h2>
                <p className="mt-4 text-muted-foreground">An 80-page analysis of how generative models are accelerating reconnaissance, social engineering, and operational tradecraft against Fortune 500 environments.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
                    Read Report <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary px-4 py-2.5 text-sm font-semibold">Executive Summary</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c.t} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/60 hover:text-primary transition">
                <c.icon className="h-3.5 w-3.5" /> {c.t}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.t} delay={(i % 3) * 0.05}>
                <article className="group h-full rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 transition">
                  <div className="relative aspect-[16/9] bg-[oklch(0.16_0.006_280)] overflow-hidden">
                    <div className="absolute inset-0 cyber-grid-sm opacity-50" />
                    <div className="absolute inset-x-4 bottom-4 h-1 rounded bg-primary/70" style={{ width: `${30 + (i * 13) % 60}%` }} />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-primary">{a.cat}</div>
                    <h3 className="mt-2 font-display text-base font-semibold leading-snug group-hover:text-primary transition">{a.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.d}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-primary transition">Read <ChevronRight className="h-3 w-3" /></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Threat dashboard */}
      <section className="py-20 sm:py-24 bg-[oklch(0.13_0.005_280)] text-[oklch(0.95_0_0)] relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live Threat Board
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold">Active intelligence, updated continuously.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { k: "Active Campaigns", v: "37" },
              { k: "New IOCs / hr", v: "12,480" },
              { k: "Industry Alerts", v: "9" },
              { k: "Patched CVEs (24h)", v: "146" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-white/55">{s.k}</div>
                <div className="mt-2 font-display text-3xl font-bold text-primary">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/55 mb-3">Top alerts · last 24h</div>
            <ul className="divide-y divide-white/10 text-sm">
              {[
                { s: "CRIT", t: "Active exploitation of CVE-2026-0418 in EU manufacturing" },
                { s: "HIGH", t: "Phishing wave impersonating major payroll provider" },
                { s: "HIGH", t: "Credential stuffing surge against telecom logins" },
                { s: "MED", t: "New ransomware affiliate program advertising on dark forums" },
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-3 py-2.5">
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${r.s === "CRIT" ? "bg-primary/20 text-primary" : r.s === "HIGH" ? "bg-primary/10 text-primary" : "bg-white/10 text-white/70"}`}>{r.s}</span>
                  <span className="flex-1">{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader eyebrow="Newsletter" title={<>Stay ahead of <span className="text-primary">emerging threats</span>.</>} subtitle="Receive cybersecurity intelligence reports and industry analysis directly from our research team." align="center" />
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="work@company.com" className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            <button className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">Subscribe to Updates</button>
          </form>
        </div>
      </section>
    </>
  );
}
