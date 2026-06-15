import React, { useRef, useState } from "react";
import axios from "axios";
import { Search, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "./Markdown";

const API = `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

// Neutral, system-wide framing — not justice-only, not advocacy
// The mirror we hold up reflects the entire institutional landscape
const SUGGESTIONS = [
  "Any public institution — court, agency, creditor, or officer",
  "A statute, rule, or published public record",
  "A pattern, a disparity, or a documented obligation",
];

const CHIPS = [
  "Aptitudinal Alignment — what it measures and why",
  "Oregon STOP data — statewide stop disparities",
  "Credit bureau dispute rights under FCRA",
  "Court financial obligations and ability-to-pay",
  "ORS 90.245 — prohibited lease provisions",
  "DPSST — officer certification and decertification",
];

export const SearchBar = () => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const sessionRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API}/search`, {
        query,
        session_id: sessionRef.current,
      });
      sessionRef.current = res.data.session_id;
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error("The query could not be heard. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="search" className="w-full max-w-6xl mt-10 md:mt-12 mx-auto" data-testid="hero-search-wrap">
      <div className="text-center mb-4 text-[10.5px] uppercase tracking-[0.36em] text-secondary" data-testid="hero-search-modes">
        {SUGGESTIONS.map((s, i) => (
          <span key={s}>
            {i > 0 && <span className="mx-2 text-gold opacity-60">·</span>}
            <span className="text-ivory-dim">{s}</span>
          </span>
        ))}
      </div>

      <form onSubmit={onSubmit} className="apt-search-soft group relative flex items-center">
        <Search className="w-4 h-4 text-gold mr-4 flex-shrink-0 opacity-80" strokeWidth={1.4} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search any institution, obligation, statute, or public record…"
          className="flex-1 text-base md:text-xl outline-none border-0 bg-transparent py-4 md:py-5"
          aria-label="Search the record"
          data-testid="hero-search-input"
        />
        <button
          type="submit"
          disabled={loading || !q.trim()}
          className="ml-3 inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10.5px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          data-testid="hero-search-submit"
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" />Inquire</span>
          }
        </button>
      </form>

      <div
        className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-5 text-[11px] tracking-[0.18em] uppercase text-secondary"
        data-testid="hero-search-suggestions"
      >
        {CHIPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            className="link-quiet"
            data-testid={`suggestion-${s.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}`}
          >
            {s}
          </button>
        ))}
      </div>

      {(loading || result) && (
        <div
          className="mt-8 relative rounded-sm border border-line-strong bg-[rgba(13,18,28,0.78)] backdrop-blur-xl px-6 md:px-9 py-6 md:py-8 text-left"
          data-testid="search-result-panel"
        >
          <div className="flex items-center gap-3 mb-5 text-[10.5px] uppercase tracking-[0.32em] text-gold">
            <span className="w-4 h-px bg-[var(--apt-gold)]" />
            The Record Responds
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-ivory-dim">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span className="font-serif-h italic">Consulting the record…</span>
            </div>
          ) : (
            <article className="font-ui text-ivory-dim leading-relaxed text-[15px]">
              <Markdown text={result.answer} />
            </article>
          )}
        </div>
      )}
    </div>
  );
};
