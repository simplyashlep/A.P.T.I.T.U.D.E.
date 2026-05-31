import React from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";

export const PageShell = ({ children, eyebrow, title, italicTitle, intro, dataStatus = null, testId }) => (
  <div className="relative min-h-screen" data-testid={testId}>
    <TopNav />
    <main className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16 max-w-4xl">
          <div className="eyebrow mb-5">{eyebrow}</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02]">
            {title}
            {italicTitle && (
              <>
                <br />
                <span className="italic text-gold">{italicTitle}</span>
              </>
            )}
          </h1>
          {intro && (
            <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
              {intro}
            </p>
          )}
        </div>

        {dataStatus && (
          <div className="mb-12 md:mb-16 border border-line-strong rounded-sm bg-[rgba(13,18,28,0.55)] p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5" data-testid="data-status-panel">
            <div className="flex items-center gap-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--apt-gold)] opacity-50 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--apt-gold)]" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-[0.36em] text-gold">Data Status</div>
                <div className="mt-1 text-ivory font-serif-h italic text-lg">{dataStatus.title}</div>
              </div>
            </div>
            <p className="text-ivory-dim text-[14px] leading-relaxed max-w-xl">
              {dataStatus.description}
            </p>
          </div>
        )}

        {children}
      </section>
    </main>
    <Footer />
  </div>
);