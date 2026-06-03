import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Landmark } from "lucide-react"

const NAV_LINKS = [
  { to: "/", label: "Home", desc: "The record, organized. Every pillar, every page, every purpose." },
  { to: "/judiciary", label: "Judiciary", desc: "Every sitting judge in Oregon — identity, metrics, and deep record." },
  { to: "/watchtower", label: "Watchtower", desc: "Prosecutors by office and individual — charging tendencies and disparity." },
  { to: "/law-enforcement", label: "Law Enforcement", desc: "Every officer in Oregon — searchable by agency, rank, and record." },
  { to: "/community-corrections", label: "Community Corrections", desc: "Parole and probation officers by county — caseloads and outcomes." },
  { to: "/bias-beacon", label: "Bias Beacon", desc: "The dashboard. STOP data, conviction rates, heat maps, and budget flow." },
  { to: "/juris-lab", label: "Juris Lab", desc: "Upload documents. AI agents analyze, inform, draft, and surface comparable cases." },
  { to: "/community", label: "Community", desc: "Public comment, statewide meetings, complaint pathways, and groups." },
  { to: "/about", label: "About", desc: "The founders, the methodology, and why we built this for Oregon." },
]

export function TopNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [location])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,26,0.6)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
      data-testid="top-nav"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <div className="flex flex-col">
          <Link
            to="/"
            className="font-display text-xl text-ivory tracking-[0.24em] hover:text-gold transition-colors duration-300"
            data-testid="nav-logo"
          >
            A<span className="text-gold">.</span>P<span className="text-gold">.</span>T<span className="text-gold">.</span>I<span className="text-gold">.</span>T<span className="text-gold">.</span>U<span className="text-gold">.</span>D<span className="text-gold">.</span>E<span className="text-gold">.</span>
          </Link>
          <span className="hidden md:block text-[9.5px] uppercase tracking-[0.38em] text-secondary/40 leading-none mt-0.5">
            Oregon&rsquo;s First Judicial Dataset &middot; MMXXVI
          </span>
        </div>

        {/* Courthouse icon — 3D embossed metallic */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(!open)}
          className={`nav-courthouse relative z-10 transition-all duration-500 ${
            open ? "nav-courthouse-open" : ""
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          data-testid="nav-menu-toggle"
        >
          <Landmark
            className={`w-6 h-6 transition-all duration-500 ${
              open ? "text-gold" : "text-ivory-dim"
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Dropdown menu */}
      <div
        ref={menuRef}
        className={`overflow-hidden transition-all duration-[400ms] ease-out ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        data-testid="nav-dropdown-menu"
      >
        <div className="bg-[rgba(10,15,26,0.98)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-5">
            <div className="flex flex-col">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`nav-link-item group block relative py-3.5 overflow-hidden transition-all duration-300 ${
                      i !== 0 ? "border-t border-[rgba(255,255,255,0.04)]" : ""
                    }`}
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`nav-link-label text-[13px] uppercase tracking-[0.28em] transition-colors duration-300 ${
                          isActive ? "text-gold" : "text-ivory-dim/60 group-hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span
                        className={`nav-link-desc text-[12px] italic font-serif-h text-secondary/0 group-hover:text-secondary/70 transition-all duration-[500ms] ease-out max-w-md text-right leading-snug ${
                          isActive ? "text-secondary/70" : ""
                        }`}
                      >
                        {link.desc}
                      </span>
                    </div>
                    {/* Gold bar underline — expands left to right on hover */}
                    <span
                      className={`nav-gold-bar absolute bottom-0 left-0 h-[2px] bg-[var(--apt-gold)] transition-all duration-[500ms] ease-out ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
