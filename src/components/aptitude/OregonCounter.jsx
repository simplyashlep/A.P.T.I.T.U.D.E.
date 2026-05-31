import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const formatValue = (v, kind) => {
  if (v >= 1000) return v.toLocaleString();
  if (kind === "percent") return `${v}%`;
  return v;
};

const AnimatedNumber = ({ value }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{n.toLocaleString()}</span>;
};

export const OregonCounter = () => {
  const [facts, setFacts] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/oregon-facts`)
      .then((r) => {
        if (!cancelled) setFacts(r.data.facts || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!facts.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % facts.length), 5200);
    return () => clearInterval(id);
  }, [facts.length]);

  if (!facts.length) return null;
  const f = facts[idx];

  return (
    <div
      className="w-full border-t border-line/70 mt-auto"
      data-testid="oregon-counter"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-6 md:py-7 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-10">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--apt-gold)] animate-pulse" />
          <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">
            Oregon · Did You Know
          </span>
        </div>

        <div className="flex items-baseline gap-5 md:gap-7 flex-1 min-w-0" key={idx}>
          <span
            className="font-display text-4xl md:text-5xl text-ivory leading-none counter-tabular"
            style={{ animation: "fadeUp 700ms cubic-bezier(.22,.61,.36,1)" }}
          >
            <AnimatedNumber value={f.value} />
            {f.kind === "percent" && <span className="text-gold">%</span>}
          </span>
          <span
            className="font-serif-h italic text-base md:text-lg text-ivory-dim leading-snug max-w-2xl"
            style={{ animation: "fadeUp 800ms cubic-bezier(.22,.61,.36,1) 80ms both" }}
          >
            {f.label}
          </span>
        </div>

        <div className="hidden md:flex flex-shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.36em] text-secondary">
          <span>{f.source}</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 md:px-10 pb-4 flex gap-2">
        {facts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show fact ${i + 1}`}
            className={`h-px transition-all duration-500 ${i === idx ? "w-10 bg-[var(--apt-gold)]" : "w-5 bg-[var(--apt-line-strong)]"}`}
            data-testid={`oregon-counter-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
};
