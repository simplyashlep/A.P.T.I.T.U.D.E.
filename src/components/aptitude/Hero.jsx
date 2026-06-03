import React, { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCES = [
  "/media/lady-justice.mp4",
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

    // Attempt playback on mount — browsers may block autoplay without a user gesture
    const tryPlay = async () => {
      try {
        await v.play();
      } catch (_) {
        // Muted autoplay should still work; if not, fall through to error handler
      }
    };
    tryPlay();

    const onErr = () => {
      if (srcIdx + 1 < HERO_VIDEO_SOURCES.length) {
        setSrcIdx((i) => i + 1);
      } else {
        setVideoOk(false);
      }
    };

    const onCanPlay = () => {
      // Video loaded successfully — ensure it plays
      try { v.play().catch(() => {}); } catch (_) {}
    };

    v.addEventListener("error", onErr);
    v.addEventListener("canplay", onCanPlay);
    return () => {
      v.removeEventListener("error", onErr);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [srcIdx]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Base dark canvas */}
      <div className="absolute inset-0 z-0 bg-[#070B14]" />

      {/* Lady Justice — positioned to the right, contained (not cropped), framed */}
      <div className="absolute inset-y-0 right-0 z-[1] w-full md:w-[58%] lg:w-[52%] hero-justice-frame">
        {videoOk ? (
          <video
            ref={videoRef}
            className="hero-video hero-justice-media absolute inset-0 w-full h-full"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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
            className="hero-fallback-img hero-justice-media absolute inset-0 w-full h-full"
            data-testid="hero-fallback-image"
          />
        )}

        {/* Left-edge gradient that blends her into the dark canvas */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none" />
        {/* Top + bottom soft vignette so she feels framed like a portrait */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070B14] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070B14] to-transparent pointer-events-none" />
      </div>

      {/* Decorative gold hairlines */}
      <div className="absolute left-6 md:left-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.22)] to-transparent z-[3]" />
      <div className="absolute right-6 md:right-10 top-24 bottom-44 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.22)] to-transparent z-[3]" />

      {/* Content — left-anchored on desktop, centered on mobile */}
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 pt-28 pb-10">
        <div className="max-w-3xl xl:max-w-4xl flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <Wordmark
            size="lg"
            embossed
            className="text-ivory justify-center md:justify-start"
          />

          <p
            className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em]"
            data-testid="hero-acronym"
          >
            A&nbsp;Platform&ensp;&middot;&ensp;Tracking&ensp;&middot;&ensp;Institutional&ensp;&middot;&ensp;Trends&ensp;&middot;&ensp;Uncovering&ensp;&middot;&ensp;Disparate&ensp;&middot;&ensp;Enforcement
          </p>

          <p
            className="mt-9 md:mt-10 font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug"
            data-testid="hero-tagline"
          >
            Accountability Is Real<span className="text-gold">.</span>
          </p>

          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      <OregonCounter />
    </section>
  );
};
