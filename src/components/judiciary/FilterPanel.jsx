import React, { useEffect, useRef } from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { CASE_TYPES } from "./CaseType";

const FILTER_LABELS = {
  critical: "Critical", high: "High", moderate: "Moderate", low: "Low", pending: "Pending",
};

const CaseTypeChip = ({ type, checked, onToggle }) => (
  <label className="flex items-center gap-2.5 px-4 py-2.5 border rounded-sm cursor-pointer transition-colors select-none"
    style={{
      borderColor: checked ? "rgba(200,169,126,0.6)" : "rgba(245,241,230,0.12)",
      background: checked ? "rgba(200,169,126,0.1)" : "transparent",
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="accent-[#C8A97E] w-4 h-4"
      aria-label={type}
      data-testid={`case-type-${type.toLowerCase()}`}
    />
    <span className="text-[12px] uppercase tracking-[0.24em] text-ivory-dim">{type}</span>
  </label>
);

const FilterPanel = ({ open, onClose, triggerRef, filters, onChange, resultCount, counties, courts }) => {
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Close helper: close the panel and hand focus back to the trigger.
  const close = () => {
    onClose();
    triggerRef.current?.focus();
  };

  // Focus management: move into the panel on open.
  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  // Escape + simple focus trap.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll("input, select, button");
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={close}
        data-testid="filter-backdrop"
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter judges"
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[420px] flex flex-col bg-[#0A0F1A] border-l border-[rgba(200,169,126,0.25)] shadow-2xl"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 460ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        data-testid="filter-panel"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span className="font-display text-xl text-ivory">Filters</span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="text-secondary hover:text-gold transition-colors p-1"
            data-testid="filter-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Search */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-q">Search</label>
            <input
              ref={firstFieldRef}
              id="fp-q"
              type="text"
              value={filters.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Name, county, or court…"
              className="w-full apt-search-soft px-4 py-3 text-[14px]"
              data-testid="fp-search"
            />
          </div>

          {/* County / Court / Risk selects */}
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-county">County</label>
              <select id="fp-county" value={filters.county} onChange={(e) => set({ county: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-county">
                <option value="">All counties</option>
                {counties.map((c) => <option key={c} value={c} className="bg-[#0A0F1A]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-court">Court</label>
              <select id="fp-court" value={filters.court} onChange={(e) => set({ court: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-court">
                <option value="">All courts</option>
                {courts.map((c) => <option key={c} value={c} className="bg-[#0A0F1A]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3" htmlFor="fp-risk">Risk level</label>
              <select id="fp-risk" value={filters.risk} onChange={(e) => set({ risk: e.target.value })}
                className="apt-search-soft w-full px-4 py-3 text-[13px] uppercase tracking-[0.2em] text-ivory-dim appearance-none cursor-pointer" data-testid="fp-risk">
                <option value="">All risk levels</option>
                {Object.entries(FILTER_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#0A0F1A]">{v}</option>)}
              </select>
            </div>
          </div>

          {/* Case type — multi-select */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.32em] text-secondary mb-3">Case type</label>
            <div className="grid grid-cols-2 gap-2.5">
              {CASE_TYPES.map((t) => (
                <CaseTypeChip
                  key={t} type={t}
                  checked={filters.caseTypes.includes(t)}
                  onToggle={() => set({
                    caseTypes: filters.caseTypes.includes(t)
                      ? filters.caseTypes.filter((x) => x !== t)
                      : [...filters.caseTypes, t],
                  })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-line space-y-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-secondary" data-testid="fp-result-count">
            <span>{resultCount} {resultCount === 1 ? "judge" : "judges"} matched</span>
            <span className="text-gold">211 total</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange({ q: "", county: "", risk: "", court: "", caseTypes: [] })}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
              data-testid="filter-clear-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />Clear all
            </button>
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-colors"
              data-testid="filter-apply"
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
