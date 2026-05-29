import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Shield, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "motion/react";
import { BRAND_NAME } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About Us" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-glow glow-orange">
            <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">{BRAND_NAME}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Enterprise security platform</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/contact"
            className="hidden sm:inline-flex group relative items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-orange"
          >
            Book Consultation
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border glass"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV.map((i) => (
                <Link key={i.to} to={i.to} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                  {i.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                <button onClick={toggle} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  Toggle theme
                </button>
                <Link to="/contact" className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Book Consultation</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
