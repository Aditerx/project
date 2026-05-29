import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Eye, ShieldCheck, Sparkles, Activity, Globe2, Award, Users, Building2 } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionHeader, Reveal } from "../components/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | IP Protection" },
      { name: "description", content: "We help organizations defend critical infrastructure through AI-powered threat intelligence and elite security operations." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About IP Protection"
        title={<>Securing the future of <span className="text-primary">digital infrastructure</span>.</>}
        subtitle="We help organizations defend critical systems through intelligent threat detection, advanced security operations, and AI-driven cybersecurity solutions."
        cta={
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Meet Our Experts <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Story */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Our Story" title={<>A team built for the <span className="text-primary">modern threat landscape</span>.</>} />
          </div>
          <div className="lg:col-span-7 text-muted-foreground leading-relaxed space-y-4">
            <p>Founded by cybersecurity professionals and digital intelligence specialists, IP Protection was built to help organizations navigate an increasingly complex threat landscape. From advanced persistent threats to AI-enabled fraud, the perimeter of defense has shifted and the playbooks have to follow.</p>
            <p>We combine human expertise with AI-powered technology to deliver scalable, proactive cybersecurity solutions for modern enterprises across every regulated sector and continent.</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[["2018", "Founded"], ["220+", "Specialists"], ["12", "Regions"]].map(([k, v]) => (
                <div key={v} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-display text-2xl font-bold text-foreground">{k}</div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-5">
          {[
            { icon: Target, t: "Mission", d: "To deliver intelligent cybersecurity solutions that empower organizations to operate securely in a rapidly evolving digital world." },
            { icon: Eye, t: "Vision", d: "To become a globally trusted leader in AI-powered cyber defense and threat intelligence." },
          ].map((b) => (
            <Reveal key={b.t}>
              <div className="h-full rounded-2xl border border-border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">{b.t}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Core Values" title={<>Principles that guide <span className="text-primary">every defense decision</span>.</>} align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "Integrity", d: "Transparent operations, ethical intelligence, accountable outcomes." },
              { icon: Sparkles, t: "Innovation", d: "Continuous investment in AI, automation, and adversary research." },
              { icon: Activity, t: "Resilience", d: "Designed to keep operating when others fail — by people and systems." },
              { icon: ShieldCheck, t: "Continuous Protection", d: "Never-off defense across every region, surface, and time zone." },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary"><v.icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Leadership" title={<>Operators behind the <span className="text-primary">platform</span>.</>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "A. Mercer", r: "Chief Executive Officer" },
              { n: "L. Hoshino", r: "Chief Security Officer" },
              { n: "R. Adekunle", r: "Head of Threat Intelligence" },
              { n: "S. Vargas", r: "Director of Security Operations" },
            ].map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[oklch(0.2_0.006_280)] overflow-hidden">
                    <div className="absolute inset-0 cyber-grid-sm opacity-40" />
                    <div className="absolute inset-0 grid place-items-center text-white/30 font-display text-5xl">{p.n.split(" ").map(s => s[0]).join("")}</div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="font-display text-base font-semibold">{p.n}</div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">{p.r}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Global Operations */}
      <section className="py-20 sm:py-24 bg-[oklch(0.13_0.005_280)] text-[oklch(0.95_0_0)] relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
              <Globe2 className="h-3 w-3 text-primary" /> Global Operations
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight">A distributed defense fabric across <span className="text-primary">every region</span>.</h2>
            <p className="mt-3 text-white/65">Our distributed security infrastructure enables 24/7 monitoring, rapid response, and global threat visibility across multiple regions and industries.</p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {["North America · Toronto, Austin", "Europe · London, Berlin, Tallinn", "Asia-Pacific · Singapore, Tokyo, Sydney", "Middle East · Dubai"].map((l) => (
                <li key={l} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {l}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <WorldMap />
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Certifications & Compliance" title={<>Audited. <span className="text-primary">Aligned.</span> Accountable.</>} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["ISO 27001", "SOC 2 Type II", "GDPR Readiness", "Enterprise Security Standards"].map((c) => (
              <div key={c} className="rounded-2xl border border-border bg-card p-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                <div className="font-display text-base font-semibold">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 rounded-3xl border border-border bg-card p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground"><Users className="h-3 w-3 text-primary" /> Careers</div>
              <h3 className="mt-3 font-display text-3xl font-bold">Join the future of cyber defense.</h3>
              <p className="mt-2 text-muted-foreground max-w-xl">Work alongside security analysts, engineers, and intelligence experts building next-generation cybersecurity solutions.</p>
            </div>
            <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
              Explore Careers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function WorldMap() {
  // dotted-style stylized world map placeholder
  const dots: { x: number; y: number; r?: number; hot?: boolean }[] = [];
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 44; x++) {
      // stylized landmass mask (rough)
      const nx = x / 44, ny = y / 22;
      const inMap =
        (nx > 0.05 && nx < 0.28 && ny > 0.2 && ny < 0.75) ||
        (nx > 0.35 && nx < 0.55 && ny > 0.15 && ny < 0.7) ||
        (nx > 0.6 && nx < 0.92 && ny > 0.18 && ny < 0.78);
      if (inMap && Math.random() > 0.35) dots.push({ x, y });
    }
  }
  const hubs = [{ x: 9, y: 8 }, { x: 18, y: 7 }, { x: 31, y: 9 }, { x: 38, y: 14 }, { x: 25, y: 17 }];
  return (
    <div className="relative aspect-[2/1] rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="absolute inset-0 cyber-grid-sm opacity-30" />
      <svg viewBox="0 0 440 220" className="absolute inset-0 w-full h-full">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x * 10 + 5} cy={d.y * 10 + 5} r="1.2" fill="oklch(0.85 0 0 / 0.45)" />
        ))}
        {hubs.map((h, i) => (
          <g key={i}>
            <circle cx={h.x * 10 + 5} cy={h.y * 10 + 5} r="10" fill="oklch(0.72 0.21 42 / 0.18)" />
            <circle cx={h.x * 10 + 5} cy={h.y * 10 + 5} r="3" fill="oklch(0.72 0.21 42)" />
          </g>
        ))}
        <path d="M95 85 Q 200 20 315 95" stroke="oklch(0.72 0.21 42 / 0.6)" strokeDasharray="3 4" fill="none" />
        <path d="M315 95 Q 320 130 255 175" stroke="oklch(0.72 0.21 42 / 0.6)" strokeDasharray="3 4" fill="none" />
      </svg>
      <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/70">
        <Building2 className="h-3 w-3 text-primary" /> 5 hub regions · 24/7
      </div>
    </div>
  );
}
