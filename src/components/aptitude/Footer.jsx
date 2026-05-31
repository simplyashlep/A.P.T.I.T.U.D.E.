import React from "react"
import { Link } from "react-router-dom"

const FOOTER_LINKS = [
  { to: "/bias-beacon", label: "Bias Beacon" },
  { to: "/about", label: "Methodology" },
  { to: "/about", label: "Disclaimers" },
  { to: "/about", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--apt-line)]" data-testid="site-footer">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-display text-lg text-ivory tracking-[0.18em]">
              A<span className="text-gold">.</span>P<span className="text-gold">.</span>T<span className="text-gold">.</span>I<span className="text-gold">.</span>T<span className="text-gold">.</span>U<span className="text-gold">.</span>D<span className="text-gold">.</span>E<span className="text-gold">.</span>
            </div>
            <p className="text-[12px] text-ivory-dim/60 italic font-serif-h mt-1 max-w-md">
              Advanced Platform Tabulating Institutional Trends Unmasking Disparity Epidemics
            </p>
          </div>

          <div className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[10.5px] uppercase tracking-[0.28em] text-ivory-dim/60 hover:text-gold transition-colors duration-300"
                data-testid={`footer-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--apt-line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-ivory-dim/40">
          <p>&copy; {new Date().getFullYear()} A.P.T.I.T.U.D.E. All rights reserved.</p>
          <p className="font-serif-h italic">
            Data sourced from the Oregon Judicial Department and Oregon Blue Book.
          </p>
        </div>
      </div>
    </footer>
  )
}
