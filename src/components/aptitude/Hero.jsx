import React, { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCES = ["/media/media/blj.mp4"];

export const Hero = () => {
  const videoRef    = useRef(null);
  const frameRef    = useRef(null);
  const clipTextRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [srcIdx,  setSrcIdx]  = useState(0);

  useEffect(() => {
    const updateClip = () => {
      const txt   = clipTextRef.current;
      const frame = frameRef.current;
      if (!txt || !frame) return;
      const { width, height } = frame.getBoundingClientRect();
      txt.setAttribute("x", String(Math.round(width  / 2)));
      txt.setAttribute("y", String(Math.round(height * 0.52)));
    };
    updateClip();
    const ro = new ResizeObserver(updateClip);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const onErr = () => {
      if (srcIdx + 1 < HERO_VIDEO_SOURCES.length) {
        setSrcIdx((i) => i + 1);
      } else {
        setVideoOk(false);
      }
    };
    v.addEventListener("error",   onErr);
    v.addEventListener("canplay", tryPlay);
    tryPlay();
    return () => {
      v.removeEventListener("error",   onErr);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [srcIdx]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 z-0 bg-[#070B14]" />

      <div
        ref={frameRef}
        className="absolute inset-0 z-[1] hero-justice-frame"
        aria-hidden="true"
      >
        <svg className="hero-justice-clip" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="aptitudeWordClip" clipPathUnits="userSpaceOnUse">
              <text
                ref={clipTextRef}
                x="800"
                y="300"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                APTITUDE
              </text>
            </clipPath>
          </defs>
        </svg>

        {videoOk ? (
          <video
            ref={videoRef}
            className="hero-justice-media hero-walk"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            key={HERO_VIDEO_SOURCES[srcIdx]}
            data-testid="hero-video"
          >
            <source src={HERO_VIDEO_SOURCES[srcIdx]} type="video/mp4" />
          </video>
        ) : (
          <div
            className="hero-justice-media"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,169,126,0.55) 0%, rgba(200,169,126,0.20) 50%, transparent 80%)",
            }}
            data-testid="hero-fallback"
          />
        )}
      </div>

      <div
        className="absolute left-6 md:left-10 top-24 bottom-40 w-px z-[3]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }}
      />
      <div
        className="absolute right-6 md:right-10 top-24 bottom-40 w-px z-[3]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }}
      />

      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 pt-28 pb-10">
        <div className="max-w-3xl xl:max-w-4xl flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <Wordmark size="lg" embossed className="text-ivory justify-center md:justify-start" />
          <p
            className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em]"
            data-testid="hero-acronym"
          >
            A&nbsp;Platform&ensp;&middot;&ensp;Tracking&ensp;&middot;&ensp;Institutional&ensp;&middot;&ensp;Trends
            &ensp;&middot;&ensp;Uncovering&ensp;&middot;&ensp;Disparate&ensp;&middot;&ensp;Enforcement
          </p>
          <p
            className="mt-9 md:mt-10 font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug"
            data-testid="hero-tagline"
          >
            Accountability Is Real<span className="text-gold">.</span>
          </p>
          <div className="w-full max-w-xl mt-8">
            <SearchBar />
          </div>
        </div>
      </div>

      <OregonCounter />
    </section>
  );
};
