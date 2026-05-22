import React, { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCES = [
  "/media/lady-justice.mp4",
  "https://cdn.pixabay.com/video/2023/10/14/185079-873431597_large.mp4",
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
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ boxShadow: "inset 0 0 240px 40px rgba(0,0,0,0.88)" }}
      />
      <div className="absolute left-6 md:left-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.22)] to-transparent z-[4]" />
      <div className="absolute right-6 md:right-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.22)] to-transparent z-[4]" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-10 pt-28 pb-10">
        <div className="eyebrow mb-6 opacity-90" data-testid="hero-eyebrow">
          Oregon  ·  MMXXV  ·  The First Judicial Dataset
        </div>

        <Wordmark size="lg" embossed className="text-ivory text-center justify-center" />

        {/* Clean spelled-out acronym — single italic line, no letter prefixes */}
        <p
          className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em] text-center max-w-3xl"
          data-testid="hero-acronym"
        >
          A&nbsp;Platform Tracking Institutional Trends Uncovering Disparate Enforcement
        </p>

        <div className="mt-9 md:mt-10 max-w-2xl text-center">
          <p className="font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug" data-testid="hero-tagline">
            Accountability Is Real<span className="text-gold">.</span>
          </p>
        </div>

        <SearchBar />
      </div>

      <OregonCounter />
    </section>
  );
};
