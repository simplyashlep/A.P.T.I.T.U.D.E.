// Shared visual primitives for A.P.T.I.T.U.D.E.
import React from "react";

export const APTITUDE_FULL =
  "A Platform · Tracking · Institutional · Trends · Uncovering · Disparate · Enforcement";

export const APTITUDE_WORDS = [
  { letter: "A", word: "A" },
  { letter: "P", word: "Platform" },
  { letter: "T", word: "Tracking" },
  { letter: "I", word: "Institutional" },
  { letter: "T", word: "Trends" },
  { letter: "U", word: "Uncovering" },
  { letter: "D", word: "Disparate" },
  { letter: "E", word: "Enforcement" },
];

export const ScaleLogo = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="apt-lg1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#D9BE93" />
        <stop offset="100%" stopColor="#A8895F" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#apt-lg1)" strokeWidth="1.25" strokeLinecap="round">
      <line x1="32" y1="8" x2="32" y2="54" />
      <line x1="22" y1="54" x2="42" y2="54" />
      <line x1="12" y1="20" x2="52" y2="20" />
      <path d="M12 20 L6 34 Q12 38 18 34 Z" fill="rgba(217,190,147,0.08)" />
      <path d="M52 20 L46 34 Q52 38 58 34 Z" fill="rgba(217,190,147,0.08)" />
      <circle cx="32" cy="20" r="1.6" fill="#D9BE93" stroke="none" />
    </g>
  </svg>
);

export const Wordmark = ({ size = "md", className = "", embossed = false }) => {
  const sizes = {
    sm: "text-base tracking-[0.42em]",
    md: "text-xl tracking-[0.42em]",
    lg: "text-5xl md:text-7xl lg:text-[6.5rem] tracking-[0.16em] md:tracking-[0.20em]",
  };
  const letters = "APTITUDE".split("");
  return (
    <div
      className={`font-display ${sizes[size]} flex items-baseline wordmark-letters ${embossed ? "wordmark-3d" : ""} ${className}`}
      data-testid={`brand-wordmark-${size}`}
      aria-label="A.P.T.I.T.U.D.E."
    >
      {letters.map((l, i) => (
        <span key={i}>
          {l}
          <span className="text-gold opacity-70 mx-[0.04em]">.</span>
        </span>
      ))}
    </div>
  );
};
