import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Radar, ShieldCheck, AlertOctagon, Cloud, Globe2, Eye, FileCheck2, Server, Plug, Workflow, ChevronRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionHeader, Reveal } from "../components/Section";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions | IP Protection" },
      { name: "description", content: "Threat intelligence, SOC operations, incident response, cloud security, brand protection and infrastructure security for modern enterprises." },
    ],
  }),
  component: SolutionsPage,
});

const services = [
  { icon: Radar, t: "Threat Intelligence", d: "Adversary-aware intelligence enriched by global telemetry and dark-web monitoring.", caps: ["IOC enrichment", "Actor profiling", "Dark-web monitoring"], hi: "Sub-minute correlation" },
  { icon: Workflow, t: "Security Operations Center (SOC)", d: "Always-on monitoring with senior analysts and AI-augmented triage.", caps: ["24/7 triage", "Threat hunting", "SLA-bound response"], hi: "120+ analysts on rotation" },
  { icon: AlertOctagon, t: "Incident Response", d: "Contain, investigate, and recover with forensic-grade evidence handling.", caps: ["DFIR playbooks", "Containment", "Post-mortem"], hi: "T+15min activation" },
  { icon: Cloud, t: "Cloud Security", d: "Posture management and runtime protection for AWS, Azure, GCP and Kubernetes.", caps: ["CSPM", "Runtime detection", "Workload IAM"], hi: "Multi-cloud native" },
  { icon: ShieldCheck, t: "Brand Protection", d: "Detect phishing, impersonation, rogue apps and infrastructure abuse early.", caps: ["Domain monitoring", "App-store sweeps", "Takedown ops"], hi: "Auto-takedown" },
  { icon: Eye, t: "Digital Risk Monitoring", d: "Continuous visibility on external risk surface and leaked credentials.", caps: ["Credential leaks", "Exec exposure", "Attack-surface mgmt"], hi: "Surface-mapped" },
  { icon: FileCheck2, t: "Compliance & Governance", d: "Continuous control validation aligned with ISO, SOC 2, PCI, HIPAA, GDPR.", caps: ["Control mapping", "Audit evidence", "Risk register"], hi: "Audit-ready" },
  { icon: Server, t: "Infrastructure Security", d: "Network, endpoint and identity protection across hybrid environments.", caps: ["EDR/XDR", "Zero-trust", "Identity threat"], hi: "Zero-trust native" },
];

function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Enterprise Solutions"
        title={<>Cybersecurity solutions built for <span className="text-primary">modern threats</span>.</>}
        subtitle="Comprehensive protection powered by intelligent monitoring, rapid incident response, and advanced threat intelligence — delivered as a unified operating model."
        cta={
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Request Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Solutions grid */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Capabilities" title={<>A complete <span className="text-primary">defense stack</span>.</>} subtitle="Each capability deploys standalone or as a composed defense program across your environments." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.t} delay={(i % 2) * 0.06}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 text-foreground group-hover:text-primary group-hover:border-primary/60 transition">
                      <s.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-primary border border-primary/40 rounded px-1.5 py-0.5">{s.hi}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                      <ul className="mt-4 grid grid-cols-3 gap-2">
                        {s.caps.map((c) => (
                          <li key={c} className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-1 text-center">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionHeader eyebrow="Platform Integration" title={<>Seamless <span className="text-primary">security ecosystem</span> integration.</>} subtitle="Our platform integrates with SIEM systems, cloud infrastructure, enterprise APIs and security workflows to provide centralized visibility and automated response." />
            <ul className="mt-6 grid grid-cols-2 gap-2 max-w-md">
              {["Splunk", "MS Sentinel", "Chronicle", "Elastic", "Okta", "CrowdStrike", "SentinelOne", "ServiceNow"].map((p) => (
                <li key={p} className="rounded-md border border-border bg-card px-3 py-2 text-sm flex items-center gap-2"><Plug className="h-3.5 w-3.5 text-primary" /> {p}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <IntegrationDiagram />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Security Workflow" title={<>From signal to <span className="text-primary">resolution</span>.</>} />
          <div className="mt-12 relative">
            <div className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent hidden md:block" />
            <div className="grid md:grid-cols-5 gap-8">
              {["Detection", "Analysis", "Escalation", "Response", "Recovery"].map((s, i) => (
                <Reveal key={s} delay={i * 0.06}>
                  <div className="text-center">
                    <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background glow-orange">
                      <span className="font-mono text-sm font-bold text-primary">0{i + 1}</span>
                    </div>
                    <div className="mt-4 font-display font-semibold">{s}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case highlights */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Case Highlights" title={<>Real engagements. <span className="text-primary">Measurable outcomes.</span></>} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { sec: "Banking", c: "Coordinated phishing campaign across 4 brands.", inv: "Cross-region IOC sweep + actor attribution.", mit: "Domain takedowns + identity hardening.", res: "92% drop in successful phishing in 30 days." },
              { sec: "SaaS", c: "Suspected lateral movement post-credential leak.", inv: "Forensic timeline across 18 services.", mit: "Token revocation + zero-trust rollout.", res: "Contained in <4 hours, zero data loss." },
              { sec: "Healthcare", c: "Ransomware staging detected in backup tier.", inv: "Behavior fingerprinting + reverse-engineering.", mit: "Isolation + clean restoration playbook.", res: "Full recovery, no patient impact." },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-primary">{c.sec} · case study</div>
                  <h3 className="mt-2 font-display text-lg font-semibold">{c.c}</h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    {[["Investigation", c.inv], ["Mitigation", c.mit], ["Results", c.res]].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <dt className="w-28 shrink-0 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{k}</dt>
                        <dd className="text-foreground/90">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-primary">Discuss similar engagement <ChevronRight className="h-3 w-3" /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 rounded-3xl border border-border bg-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-60 w-[600px] rounded-full bg-primary/20 blur-3xl" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold">Strengthen your security posture today.</h2>
          <p className="relative mt-3 text-muted-foreground">Speak with a senior security architect about your environment and roadmap.</p>
          <Link to="/contact" className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Talk to Security Specialists <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function IntegrationDiagram() {
  const around = ["SIEM", "EDR", "CSPM", "IAM", "ITSM", "WAF"];
  return (
    <div className="relative aspect-square max-w-md mx-auto rounded-2xl border border-border bg-card p-6 overflow-hidden">
      <div className="absolute inset-0 cyber-grid-sm opacity-30" />
      <div className="relative w-full h-full grid place-items-center">
        <div className="relative h-28 w-28 rounded-2xl bg-primary text-primary-foreground grid place-items-center glow-orange">
          <div className="text-center">
            <div className="font-display text-sm font-bold">IP Protection</div>
            <div className="font-mono text-[9px] uppercase tracking-wider opacity-80">core</div>
          </div>
        </div>
        {around.map((n, i) => {
          const a = (i / around.length) * Math.PI * 2 - Math.PI / 2;
          const r = 130;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          return (
            <div
              key={n}
              className="absolute flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background text-xs font-mono uppercase tracking-wider"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {n}
            </div>
          );
        })}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-160 -160 320 320">
          {around.map((_, i) => {
            const a = (i / around.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * 110;
            const y = Math.sin(a) * 110;
            return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="oklch(0.72 0.21 42 / 0.4)" strokeDasharray="3 3" />;
          })}
        </svg>
      </div>
    </div>
  );
}
