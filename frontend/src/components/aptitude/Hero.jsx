import React, { useEffect, useRef, useState } from "react";
import { Wordmark, APTITUDE_WORDS } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCES = [
  "https://cdn.pixabay.com/video/2023/10/14/185079-873431597_large.mp4",
  "https://cdn.pixabay.com/video/2022/03/13/110817-687901392_large.mp4",
];
const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxsYWR5JTIwanVzdGljZSUyMHN0YXR1ZXxlbnwwfHx8fDE3Nzk0Mzc4ODl8MA&ixlib=rb-4.1.0&q=85";

export const Hero = () => {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [srcIdx, setSrcIdx] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onErr = () => {
      if (srcIdx + 1 < HERO_VIDEO_SOURCES.length) setSrcIdx((i) => i + 1);
      else setVideoOk(false);
    };
    v.addEventListener("error", onErr);
    return () => v.removeEventListener("error", onErr);
  }, [srcIdx]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Background — walking pan */}
      <div className="absolute inset-0 z-0 hero-walk-wrap">
        {videoOk ? (
          <video
            ref={videoRef}
            className="hero-video hero-walk absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={HERO_FALLBACK_IMAGE}
            key={HERO_VIDEO_SOURCES[srcIdx]}
            data-testid="hero-video"
          >
            <source src={HERO_VIDEO_SOURCES[srcIdx]} type="video/mp4" />
          </video>
        ) : (
          <img
            src={HERO_FALLBACK_IMAGE}
            alt="Lady Justice"
            className="hero-fallback-img hero-walk absolute inset-0 w-full h-full object-cover"
            data-testid="hero-fallback-image"
          />
        )}
      </div>

      <div className="absolute inset-0 hero-overlay z-[2]" />
      <div className="pointer-events-none absolute inset-0 z-[3]" style={{ boxShadow: "inset 0 0 240px 40px rgba(0,0,0,0.88)" }} />
      <div className="absolute left-6 md:left-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.25)] to-transparent z-[4]" />
      <div className="absolute right-6 md:right-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.25)] to-transparent z-[4]" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-10 pt-28 pb-10">
        <div className="eyebrow mb-6 opacity-90" data-testid="hero-eyebrow">
          Oregon · MMXXV  ·  The First Judicial Dataset
        </div>

        <Wordmark size="lg" embossed className="text-ivory text-center justify-center" />

        {/* Acronym expansion */}
        <div className="mt-6 md:mt-7 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center max-w-3xl" data-testid="hero-acronym">
          {APTITUDE_WORDS.slice(1).map((w, i) => (
            <span key={i} className="text-[10.5px] md:text-[11px] uppercase tracking-[0.36em] text-ivory-dim">
              <span className="text-gold mr-1.5 font-serif-h italic normal-case tracking-normal">{w.letter}</span>
              {w.word}
              {i < APTITUDE_WORDS.length - 2 && <span className="text-gold ml-3 opacity-70">·</span>}
            </span>
          ))}
        </div>

        <div className="mt-8 md:mt-9 max-w-2xl text-center">
          <p className="font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug" data-testid="hero-tagline">
            Accountability Is Real<span className="text-gold">.</span>
          </p>
          <p className="mt-3 text-[12px] uppercase tracking-[0.36em] text-secondary" data-testid="hero-subtagline">
            Making siloed public information cohere into the actual record
          </p>
        </div>

        <SearchBar />
      </div>

      <OregonCounter />
    </section>
  );
};
