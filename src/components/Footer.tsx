import { Link } from "@tanstack/react-router";
import { Shield, Linkedin, Twitter, Github, Globe } from "lucide-react";

import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-[oklch(0.1_0.005_280)] text-[oklch(0.92_0_0)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-glow">
              <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-bold tracking-tight">{BRAND_NAME}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {BRAND_TAGLINE} protecting internal media workflows, access control, and cloud-ready
            distribution.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Linkedin, Twitter, Github, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Company"
          links={[
            { label: "About Us", to: "/about" },
            { label: "Leadership", to: "/about" },
            { label: "Careers", to: "/about" },
            { label: "Newsroom", to: "/insights" },
          ]}
        />
        <FooterCol
          title="Solutions"
          links={[
            { label: "Threat Intelligence", to: "/solutions" },
            { label: "SOC Operations", to: "/solutions" },
            { label: "Incident Response", to: "/solutions" },
            { label: "Cloud Security", to: "/solutions" },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { label: "Insights", to: "/insights" },
            { label: "Industries", to: "/industries" },
            { label: "Contact", to: "/contact" },
            { label: "Status", to: "/" },
          ]}
        />

        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold">Threat brief newsletter</h4>
          <p className="mt-2 text-xs text-white/55">Monthly intelligence digest from our research team.</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@company.com"
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs placeholder:text-white/40 focus:border-primary focus:outline-none"
            />
            <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} IP Protection. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              SOC 2 · ISO 27001
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-white/55 transition hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

