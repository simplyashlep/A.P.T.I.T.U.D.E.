import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ScaleLogo } from "./Brand"

const NAV_LINKS = [
  { to: "/", label: "Home", desc: "The record, organized. Every pillar, every page, every purpose." },
  { to: "/judiciary", label: "Judiciary", desc: "Every sitting judge in Oregon — identity, metrics, and Aptitudinal Alignment." },
  { to: "/watchtower", label: "Watchtower", desc: "Prosecutors by office and individual — charging tendencies and disparity." },
  { to: "/law-enforcement", label: "Law Enforcement", desc: "Every officer in Oregon — searchable by agency, rank, and record." },
  { to: "/community-corrections", label: "Community Corrections", desc: "Parole and probation officers by county — caseloads and outcomes." },
  { to: "/aptitude-advancement", label: "Aptitude Advancement", desc: "Where the connection is made — financial access, digital tools, and the path forward." },
  { to: "/bias-beacon", label: "Bias Beacon", desc: "The dashboard. STOP data, conviction rates, heat maps, and budget flow." },
  { to: "/juris-lab", label: "Juris Lab", desc: "Upload documents. AI agents analyze, inform, draft, and surface comparable cases." },
  { to: "/caselaw", label: "Case Law", desc: "Search court decisions by issue, statute, or agency — with plain-language summaries and Juris Lab integration." },
  { to: "/community", label: "Community", desc: "Public comment, statewide meetings, complaint pathways, and groups." },
  { to: "/about", label: "About", desc: "The founders, the methodology, and why we built this." },
]

export function TopNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const isHome = location.pathname === "/"

  // The hero owns the wordmark. On the home page the nav lockup stays hidden
  // until you've scrolled past the hero, so the title never appears twice.
  // Every other page shows it immediately — there's no hero to defer to.
  useEffect(() => {
    if (!isHome) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

  const showWordmark = !isHome || scrolled

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

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,26,0.6)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
      data-testid="top-nav"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-testid="nav-logo"
          aria-label="A.P.T.I.T.U.D.E. — home"
        >
          {/* Always present, so the header never feels empty */}
          <ScaleLogo className="w-6 h-6 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          <span
            className="flex flex-col"
            style={{
              opacity: showWordmark ? 1 : 0,
              transform: showWordmark ? "translateY(0)" : "translateY(-4px)",
              transition: "opacity 420ms ease-out, transform 420ms ease-out",
              pointerEvents: showWordmark ? "auto" : "none",
            }}
            aria-hidden={!showWordmark}
          >
            <span className="font-display text-2xl text-ivory tracking-[0.22em] group-hover:text-gold transition-colors duration-300 leading-none">
              A<span className="text-gold">.</span>P<span className="text-gold">.</span>T<span className="text-gold">.</span>I<span className="text-gold">.</span>T<span className="text-gold">.</span>U<span className="text-gold">.</span>D<span className="text-gold">.</span>E<span className="text-gold">.</span>
            </span>
            <span className="hidden md:block text-[9.5px] uppercase tracking-[0.38em] text-secondary/40 leading-none mt-1">
              Accountability Is Infrastructure &middot; MMXXVI
            </span>
          </span>
        </Link>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(!open)}
          className={`nav-courthouse relative z-10 transition-all duration-500 ${open ? "nav-courthouse-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="nav-menu-toggle"
        >
          {/* Courthouse glyph — the pediment and ground stay, the pillars are
              replaced by the site's display face so the label is unmistakable. */}
          <span className="flex flex-col items-center justify-center gap-[3px] select-none" aria-hidden="true">
            <svg
              viewBox="0 0 44 18"
              className={`w-11 h-[18px] transition-colors duration-500 ${open ? "text-gold" : "text-ivory-dim"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15 L22 3 L40 15" />
              <line x1="22" y1="3" x2="22" y2="8" />
            </svg>
            <span
              className={`font-display text-[11px] tracking-[0.34em] leading-none transition-colors duration-500 ${
                open ? "text-gold" : "text-ivory-dim"
              }`}
            >
              MENU
            </span>
            <span className="w-11 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[var(--apt-gold)] to-transparent" />
          </span>
        </button>

        {open && (
          <div
            ref={menuRef}
            className="absolute top-16 left-0 right-0 bg-[rgba(10,15,26,0.97)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.08)] z-40"
            data-testid="nav-menu"
          >
            <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to
                const isAA = link.to === "/aptitude-advancement"
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group flex flex-col gap-1 px-4 py-4 rounded-sm transition-all duration-300 ${
                      isActive
                        ? "bg-[rgba(200,169,126,0.08)]"
                        : "hover:bg-[rgba(200,169,126,0.05)]"
                    } ${isAA ? "border border-[rgba(200,169,126,0.25)] bg-[rgba(200,169,126,0.04)]" : ""}`}
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className={`text-[11px] uppercase tracking-[0.36em] transition-colors duration-300 font-medium ${
                      isActive
                        ? "text-gold"
                        : isAA
                        ? "text-gold"
                        : "text-ivory group-hover:text-gold"
                    }`}>
                      {link.label}
                    </span>
                    <span className="text-[12px] text-secondary leading-snug">{link.desc}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
