import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, HeartPulse, Landmark, Server, ShoppingBag, Signal, Truck, Film, GraduationCap, Gamepad2, Activity, ShieldCheck, Globe2, Cpu, FileCheck2 } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionHeader, Reveal } from "../components/Section";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries | IP Protection" },
      { name: "description", content: "Tailored cyber defense for banking, healthcare, government, SaaS, telecom, logistics, e-commerce, education, gaming and media." },
    ],
  }),
  component: IndustriesPage,
});

const industries = [
  { icon: Banknote, t: "Banking & Finance", threats: "Wire fraud, account takeover, ransomware", chal: "Real-time fraud + regulatory load", sol: "Identity threat protection, SOC, AML signals", comp: "PCI DSS, SOX, DORA" },
  { icon: HeartPulse, t: "Healthcare", threats: "Ransomware, data exfil, device tampering", chal: "Connected medical devices + PHI", sol: "Network segmentation, DFIR, dark-web monitoring", comp: "HIPAA, HITRUST" },
  { icon: Landmark, t: "Government", threats: "Nation-state APTs, supply chain", chal: "Critical infra + classified data", sol: "Threat intel, zero-trust, hunting", comp: "FedRAMP, NIS2" },
  { icon: Server, t: "SaaS & Technology", threats: "Token theft, lateral movement", chal: "Multi-tenant scale + DevOps speed", sol: "Cloud-native XDR, CSPM, secrets monitoring", comp: "SOC 2, ISO 27001" },
  { icon: ShoppingBag, t: "E-Commerce", threats: "Skimmers, bot abuse, refund fraud", chal: "Seasonal scale + payment risk", sol: "Brand protection, takedowns, bot mitigation", comp: "PCI DSS, GDPR" },
  { icon: Signal, t: "Telecommunications", threats: "SIM swap, signaling abuse, DDoS", chal: "Carrier-scale network defense", sol: "Threat intel + 24/7 SOC at carrier scale", comp: "NIS2, regional CIRT mandates" },
  { icon: Truck, t: "Logistics & Supply Chain", threats: "Ransomware, GPS spoofing, vendor risk", chal: "OT/IT convergence + uptime", sol: "Asset visibility, OT monitoring, IR", comp: "ISO 28000, TSA" },
  { icon: Film, t: "Media & Entertainment", threats: "Leaks, impersonation, account abuse", chal: "Content workflows + IP protection", sol: "Brand protection, watermarking-aware DFIR", comp: "MPA TPN" },
  { icon: GraduationCap, t: "Education", threats: "Ransomware, research espionage", chal: "Open networks + limited budgets", sol: "Managed SOC + identity hardening", comp: "FERPA, GDPR" },
  { icon: Gamepad2, t: "Gaming Platforms", threats: "DDoS, cheating, fraud rings", chal: "Massive concurrency + reputation risk", sol: "Edge protection, abuse intel, takedowns", comp: "Regional consumer protection" },
];

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industry Coverage"
        title={<>Cybersecurity solutions for <span className="text-primary">critical industries</span>.</>}
        subtitle="Tailored protection strategies designed to address the unique risks and compliance requirements of modern industries — from regulated finance to high-velocity SaaS."
      />

      {/* Grid */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="By Sector" title={<>Industry-specific <span className="text-primary">threat modeling</span> and controls.</>} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {industries.map((it, i) => (
              <Reveal key={it.t} delay={(i % 2) * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 group-hover:text-primary group-hover:border-primary/60 transition">
                      <it.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold">{it.t}</h3>
                      <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {[["Threats", it.threats], ["Challenges", it.chal], ["Solutions", it.sol], ["Compliance", it.comp]].map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{k}</dt>
                            <dd className="text-foreground/90 leading-snug">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Threat landscape */}
      <section className="py-20 sm:py-24 bg-[oklch(0.13_0.005_280)] text-[oklch(0.95_0_0)] relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
              <Activity className="h-3 w-3 text-primary" /> Threat Landscape
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold">Different industries. <span className="text-primary">Different attackers.</span></h2>
            <p className="mt-3 text-white/65">Industries face unique cyber risks ranging from ransomware and phishing to infrastructure abuse and data exfiltration. We model and prioritize accordingly.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[["+38%", "ransomware YoY"], ["72%", "credential-based"], ["4.3M", "blocked / day"]].map(([k, v]) => (
                <div key={v} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <div className="font-display text-xl font-bold">{k}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/55">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <Heatmap />
          </div>
        </div>
      </section>

      {/* Enterprise benefits */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Enterprise Benefits" title={<>Measurable <span className="text-primary">outcomes</span>, across every sector.</>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { i: Activity, t: "Faster incident response" },
              { i: ShieldCheck, t: "Reduced operational risk" },
              { i: FileCheck2, t: "Improved compliance" },
              { i: Globe2, t: "Global threat visibility" },
              { i: Cpu, t: "AI-powered monitoring" },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 0.04}>
                <div className="rounded-2xl border border-border bg-card p-5 h-full hover:border-primary/60 transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary"><b.i className="h-5 w-5" /></div>
                  <div className="mt-4 font-display text-sm font-semibold leading-snug">{b.t}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 rounded-3xl border border-border bg-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-60 w-[600px] rounded-full bg-primary/20 blur-3xl" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold">Protect your industry with intelligent cyber defense.</h2>
          <Link to="/contact" className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Schedule Security Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Heatmap() {
  const cols = 16, rows = 8;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">Sector × Threat Intensity</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">last 90d</span>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const v = (Math.sin(i * 0.7) + Math.cos(i * 0.3) + 2) / 4; // 0..1
          const a = 0.08 + v * 0.85;
          return <div key={i} className="aspect-square rounded-sm" style={{ background: `oklch(0.72 0.21 42 / ${a})` }} />;
        })}
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-wider text-white/55">
        low <div className="h-2 w-24 rounded-sm bg-gradient-to-r from-primary/10 to-primary" /> high
      </div>
    </div>
  );
}
