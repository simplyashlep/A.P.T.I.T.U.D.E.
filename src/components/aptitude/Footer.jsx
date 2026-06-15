import React from "react";
import { Link } from "react-router-dom";
import { ScaleLogo, Wordmark } from "./Brand";

export const Footer = () => (
  <footer className="relative border-t border-line py-14 md:py-16 px-6 md:px-10" data-testid="footer">
    <div className="max-w-[1360px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-5">
            <ScaleLogo />
            <Wordmark size="sm" />
          </div>
          <p className="font-serif-h italic text-ivory-dim text-base leading-relaxed">
            Accountability Pathways Through Institutional Transparency, Understanding, and Data Ecosystems —
            measuring what public institutions promised against what the record shows.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.36em] text-secondary">
            Precision · Principle · Proof
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3 text-[11.5px] uppercase tracking-[0.28em]">
          <Link to="/judiciary" className="link-quiet" data-testid="footer-judiciary">Judiciary</Link>
          <Link to="/watchtower" className="link-quiet" data-testid="footer-watchtower">Watchtower</Link>
          <Link to="/law-enforcement" className="link-quiet" data-testid="footer-law-enforcement">Law Enforcement</Link>
          <Link to="/community-corrections" className="link-quiet" data-testid="footer-community-corrections">Corrections</Link>
          <Link to="/aptitude-advancement" className="link-quiet text-gold/70" data-testid="footer-aptitude-advancement">Aptitude Advancement</Link>
          <Link to="/bias-beacon" className="link-quiet" data-testid="footer-bias-beacon">Bias Beacon</Link>
          <Link to="/juris-lab" className="link-quiet" data-testid="footer-juris-lab">Juris Lab</Link>
          <Link to="/community" className="link-quiet" data-testid="footer-community">Community</Link>
          <Link to="/about" className="link-quiet" data-testid="footer-about">About</Link>
        </div>
      </div>

      <div className="gold-rule my-10" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10.5px] uppercase tracking-[0.36em] text-secondary">
        <span>© MMXXVI — A.P.T.I.T.U.D.E. · Oregon</span>
        <span className="italic font-serif-h normal-case tracking-normal text-ivory-dim text-sm">
          For research and orientation only — not a substitute for counsel or the official record.
        </span>
        <span>Public · Accountable · Disciplined</span>
      </div>
    </div>
  </footer>
);
