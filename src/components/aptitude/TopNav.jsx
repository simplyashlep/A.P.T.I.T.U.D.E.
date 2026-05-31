import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/judiciary", label: "Judiciary" },
  { to: "/watchtower", label: "Watchtower" },
  { to: "/law-enforcement", label: "Law Enforcement" },
  { to: "/community-corrections", label: "Community Corrections" },
  { to: "/bias-beacon", label: "Bias Beacon" },
  { to: "/juris-lab", label: "Juris Lab" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
]

export function TopNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,26,0.6)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
      data-testid="top-nav"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <Link
          to="/"
          className="font-display text-lg text-ivory tracking-[0.18em]"
          data-testid="nav-logo"
        >
          A<span className="text-gold">.</span>P<span className="text-gold">.</span>T<span className="text-gold">.</span>I<span className="text-gold">.</span>T<span className="text-gold">.</span>U<span className="text-gold">.</span>D<span className="text-gold">.</span>E<span className="text-gold">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] uppercase tracking-[0.28em] transition-colors duration-300 ${
                  isActive ? "text-gold" : "text-ivory-dim/70 hover:text-gold"
                }`}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden text-ivory-dim hover:text-gold"
          aria-label={open ? "Close menu" : "Open menu"}
          data-testid="nav-mobile-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[rgba(10,15,26,0.98)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)]" data-testid="nav-mobile-menu">
          <div className="max-w-[1360px] mx-auto px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-[12px] uppercase tracking-[0.28em] py-2 transition-colors ${
                    isActive ? "text-gold" : "text-ivory-dim/70 hover:text-gold"
                  }`}
                  data-testid={`nav-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
