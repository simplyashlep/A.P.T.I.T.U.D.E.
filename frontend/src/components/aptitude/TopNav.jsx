import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ScaleLogo, Wordmark } from "./Brand";

const PRIMARY_LINKS = [
  { to: "/judiciary", label: "Judiciary" },
  { to: "/watchtower", label: "Watchtower" },
  { to: "/bias-beacon", label: "Bias Beacon" },
  { to: "/juris-lab", label: "Juris Lab" },
  { to: "/community", label: "Community" },
];

export const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const linkCls = (active) =>
    `link-quiet text-[11.5px] uppercase tracking-[0.28em] ${active ? "text-gold" : ""}`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-[#0A0F1A]/80 border-b border-line" : "bg-transparent"
      }`}
      data-testid="top-nav"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-4 md:py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-brand">
          <ScaleLogo />
          <Wordmark size="sm" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={linkCls(pathname.startsWith(l.to))}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <Link to="/about" className="link-quiet text-[11.5px] uppercase tracking-[0.28em]" data-testid="nav-about">
            About
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.28em] text-gold border-b border-transparent hover:border-[var(--apt-gold)] transition-colors duration-300"
            data-testid="nav-search"
          >
            The Record
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-ivory p-2 -m-2"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-out ${
          open ? "max-h-[600px]" : "max-h-0"
        } bg-[#0A0F1A]/95 backdrop-blur-xl border-t border-line`}
        data-testid="nav-mobile-sheet"
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {[...PRIMARY_LINKS, { to: "/law-enforcement", label: "Law Enforcement" }, { to: "/community-corrections", label: "Community Corrections" }, { to: "/about", label: "About" }].map(
            (l) => (
              <Link
                key={l.to}
                to={l.to}
                className={linkCls(pathname.startsWith(l.to))}
                data-testid={`nav-mobile-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};
