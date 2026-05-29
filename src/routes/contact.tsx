import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail, Phone, MapPin, Building2, ChevronDown, ShieldAlert } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { SectionHeader, Reveal } from "../components/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | IP Protection" },
      { name: "description", content: "Discuss your cybersecurity challenges with specialists in threat intelligence, incident response, and enterprise protection." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Connect with our <span className="text-primary">security experts</span>.</>}
        subtitle="Discuss your cybersecurity challenges with specialists in threat intelligence, incident response, and enterprise protection."
      />

      {/* Form + direct */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldAlert className="h-5 w-5" /></div>
                <div>
                  <div className="font-display font-semibold">Active incident?</div>
                  <p className="text-sm text-muted-foreground mt-1">24/7 emergency response hotline for breach containment.</p>
                  <a href="tel:+18005551234" className="mt-2 inline-flex items-center gap-2 text-sm font-mono text-primary">+1 (800) 555-1234</a>
                </div>
              </div>
            </div>
            {[
              { icon: Building2, t: "Security Operations Center", v: "soc@sentinel-ai.com" },
              { icon: Mail, t: "Global Support", v: "support@sentinel-ai.com" },
              { icon: Phone, t: "Enterprise Sales", v: "+1 (415) 555-0199" },
              { icon: MapPin, t: "HQ", v: "San Francisco · London · Singapore" },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-5 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary"><c.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{c.t}</div>
                  <div className="mt-0.5 text-sm font-medium">{c.v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Global Offices" title={<>Regional <span className="text-primary">support coverage</span>.</>} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { r: "North America", c: "San Francisco · Toronto · Austin", h: "+1 (415) 555-0199" },
              { r: "Europe", c: "London · Berlin · Tallinn", h: "+44 20 7946 0911" },
              { r: "Asia-Pacific", c: "Singapore · Tokyo · Sydney", h: "+65 6500 8800" },
              { r: "Middle East", c: "Dubai", h: "+971 4 555 0145" },
            ].map((o, i) => (
              <Reveal key={o.r} delay={i * 0.05}>
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-primary">{o.r}</div>
                  <div className="mt-2 font-display font-semibold">{o.c}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{o.h}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title={<>Common questions, <span className="text-primary">answered</span>.</>} align="center" />
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 rounded-3xl border border-border bg-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-60 w-[600px] rounded-full bg-primary/20 blur-3xl" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold">Build a stronger security foundation.</h2>
          <p className="relative mt-3 text-muted-foreground">Partner with a cybersecurity team focused on intelligence, resilience, and continuous protection.</p>
          <a href="#contact-form" className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Talk to Our Team <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

const FAQ = [
  { q: "How quickly can your team respond to incidents?", a: "Our IR team activates within 15 minutes of confirmed engagement, 24/7. Emergency hotline routes directly to a senior responder on shift." },
  { q: "Do you provide 24/7 monitoring?", a: "Yes — distributed SOC operations across four global regions with follow-the-sun coverage and SLA-bound escalation." },
  { q: "Which industries do you specialize in?", a: "Banking, healthcare, government, SaaS, telecom, e-commerce, logistics, education, gaming, and media & entertainment." },
  { q: "Can your platform integrate with existing infrastructure?", a: "Native connectors for major SIEM, EDR, IAM, ITSM and cloud providers. Custom API integrations are available for bespoke environments." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="font-display font-semibold">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <div id="contact-form" className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold">Request a consultation</h2>
      <p className="text-sm text-muted-foreground mt-1">Our team responds within one business day.</p>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <Field label="Full Name" name="name" required />
        <Field label="Company" name="company" required />
        <Field label="Business Email" name="email" type="email" required />
        <Field label="Phone Number" name="phone" type="tel" />
        <Select label="Industry" name="industry" options={["Banking & Finance", "Healthcare", "Government", "SaaS & Tech", "Telecom", "E-Commerce", "Logistics", "Education", "Gaming", "Media"]} />
        <Select label="Service Interest" name="service" options={["Threat Intelligence", "SOC Operations", "Incident Response", "Cloud Security", "Brand Protection", "Compliance"]} />
        <div className="sm:col-span-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Message</label>
          <textarea name="message" rows={4} maxLength={1000} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">By submitting you agree to our privacy policy.</p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-orange">
            Request Consultation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {sent && (
          <div className="sm:col-span-2 rounded-lg border border-primary/40 bg-primary/10 text-primary px-4 py-2.5 text-sm">
            Thank you — a security specialist will reach out shortly.
          </div>
        )}
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}{required && <span className="text-primary">*</span>}</label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      <select name={name} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
