import React from "react"
import { Search } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0A0F1A]" data-testid="hero-section">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-40"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxsYWR5JTIwanVzdGljZSUyMHN0YXR1ZXxlbnwwfHx8fDE3Nzk0Mzc4ODl8MA&ixlib=rb-4.1.0&q=85"
        >
          <source
            src="https://videos.pexels.com/video-files/5940603/5940603-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[900px] w-full px-8">
        {/* Wordmark */}
        <div
          className="wordmark-3d wordmark-letters text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[0.18em] text-ivory mb-4 leading-[1.15]"
          data-testid="brand-wordmark"
        >
          A<span className="text-gold">.</span>P<span className="text-gold">.</span>T<span className="text-gold">.</span>I<span className="text-gold">.</span>T<span className="text-gold">.</span>U<span className="text-gold">.</span>D<span className="text-gold">.</span>E<span className="text-gold">.</span>
        </div>

        {/* Tagline */}
        <p className="font-serif-h italic text-[clamp(1rem,2vw,1.4rem)] text-ivory-dim tracking-[0.08em] mb-10 leading-relaxed" data-testid="hero-tagline">
          Accountability Is Real. Transparency Is The Standard. 
          <span className="text-gold">The Record Is Yours.</span>
          <span className="caret" aria-hidden="true">|</span>
        </p>

        {/* Search bar */}
        <div className="max-w-[720px] mx-auto w-full" data-testid="hero-search-wrapper">
          <div className="apt-search-soft flex items-center w-full py-4 px-5">
            <Search className="w-5 h-5 text-ivory-dim/60 mr-3 flex-shrink-0" strokeWidth={1.25} />
            <input
              type="text"
              placeholder="Search the record — judges, statutes, cases, agencies…"
              className="flex-1 bg-transparent border-none outline-none text-ivory font-ui text-[1.05rem] font-light"
              data-testid="hero-search-input"
            />
            <kbd className="hidden md:inline-flex text-[0.7rem] font-medium text-ivory-dim/40 bg-white/5 border border-white/10 rounded px-2 py-0.5 ml-3 tracking-[0.05em] font-ui">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer hidden md:block"
        data-testid="hero-scroll-indicator"
        onClick={() => {
          const tenets = document.getElementById("principles")
          if (tenets) tenets.scrollIntoView({ behavior: "smooth" })
        }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent mx-auto mb-2" />
        <p className="text-[9px] uppercase tracking-[0.36em] text-ivory-dim/50">Scroll</p>
      </div>
    </section>
  )
}
