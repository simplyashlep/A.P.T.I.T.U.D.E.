import React from "react"
import { TopNav } from "./TopNav"
import { Footer } from "./Footer"

export function PageShell({ testId, eyebrow, title, italicTitle, intro, dataStatus, children }) {
  return (
    <div className="relative min-h-screen" data-testid={testId}>
      <TopNav />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-10 md:pb-12 px-6 md:px-10 overflow-hidden">
        <div className="relative max-w-[1360px] mx-auto">
          {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
            {title}
            {italicTitle && <span className="italic text-gold"> {italicTitle}</span>}
          </h1>
          {intro && (
            <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
              {intro}
            </p>
          )}
        </div>
      </header>

      {/* Data status banner */}
      {dataStatus && (
        <section className="max-w-[1360px] mx-auto px-6 md:px-10 mb-12">
          <div className="card-3d-raised p-6 flex items-start gap-4">
            <div>
              <div className="font-display text-base text-ivory mb-1">{dataStatus.title}</div>
              <p className="text-ivory-dim text-[13px] leading-relaxed">{dataStatus.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 pb-24">
        {children}
      </section>

      <Footer />
    </div>
  )
}
