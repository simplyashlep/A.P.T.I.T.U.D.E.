import React, { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCE = "/media/grok-video-7f198128-09c2-49d4-9fdf-0948e0550a26.mp4";

const GLITCH_BARS = [
  { left: "5%", width: "7%", shiftY: -5, shiftX: -1, opacity: 0.1 },
  { left: "15%", width: "5%", shiftY: 2, shiftX: 1, opacity: 0.06 },
  { left: "24%", width: "6%", shiftY: -3, shiftX: -2, opacity: 0.08 },
  { left: "35%", width: "4.5%", shiftY: 4, shiftX: 1, opacity: 0.05 },
  { left: "44%", width: "8%", shiftY: -2, shiftX: -1, opacity: 0.09 },
  { left: "57%", width: "5%", shiftY: 4, shiftX: 2, opacity: 0.06 },
  { left: "66%", width: "7%", shiftY: -1, shiftX: 0, opacity: 0.08 },
  { left: "78%", width: "6%", shiftY: 3, shiftX: -1, opacity: 0.07 },
  { left: "87%", width: "5%", shiftY: -4, shiftX: 1, opacity: 0.07 },
];

const rightPanelStyle = {
  position: "absolute",
  right: "clamp(10px, 2.2vw, 34px)",
  top: "clamp(72px, 10.5vh, 132px)",
  width: "clamp(360px, 50vw, 820px)",
  height: "clamp(430px, 74vh, 840px)",
  clipPath: "polygon(11% 0, 100% 0, 100% 100%, 7% 100%, 0 82%, 5% 14%)",
  WebkitClipPath: "polygon(11% 0, 100% 0, 100% 100%, 7% 100%, 0 82%, 5% 14%)",
  maskImage:
    "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(180deg, transparent 0%, black 7%, black 93%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(180deg, transparent 0%, black 7%, black 93%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  overflow: "hidden",
  background: "transparent",
};

const videoShellStyle = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  background:
    "radial-gradient(120% 100% at 70% 28%, rgba(200,169,126,0.08) 0%, rgba(200,169,126,0.04) 26%, transparent 68%), linear-gradient(90deg, rgba(7,11,20,0.06) 0%, rgba(7,11,20,0.0) 26%, rgba(7,11,20,0.14) 100%)",
  filter: "saturate(0.95) contrast(1.01)",
};

const videoStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center 24%",
  transform: "scale(1.06)",
  opacity: 0.65,
  filter: "saturate(0.9) contrast(1.02) brightness(0.9)",
  mixBlendMode: "screen",
  animation: "heroVideoFloat 52s ease-in-out infinite alternate, heroVideoBreath 24s ease-in-out infinite",
};

const panelGlowStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(120% 100% at 76% 24%, rgba(200,169,126,0.09) 0%, rgba(200,169,126,0.03) 30%, transparent 72%), linear-gradient(90deg, rgba(7,11,20,0.16) 0%, rgba(7,11,20,0.03) 34%, rgba(7,11,20,0.12) 100%)",
  mixBlendMode: "screen",
  pointerEvents: "none",
};

const scanlineStyle = {
  position: "absolute",
  inset: 0,
  background:
    "repeating-linear-gradient(180deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(200,169,126,0.012) 0 1px, transparent 1px 30px)",
  opacity: 0.28,
  pointerEvents: "none",
};

const hazeStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(10,15,26,0.05) 0%, transparent 18%, transparent 80%, rgba(10,15,26,0.24) 100%)",
  pointerEvents: "none",
};

const barBaseStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  borderRadius: 999,
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(245,241,230,0.02) 0%, rgba(200,169,126,0.10) 52%, rgba(245,241,230,0.01) 100%)",
  backdropFilter: "blur(0.8px) saturate(120%)",
  WebkitBackdropFilter: "blur(0.8px) saturate(120%)",
  pointerEvents: "none",
  mixBlendMode: "screen",
};

export const Hero = () => {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = () => {
      v.playbackRate = 0.92;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const onErr = () => setVideoOk(false);

    v.addEventListener("error", onErr);
    v.addEventListener("canplay", tryPlay);
    tryPlay();

    return () => {
      v.removeEventListener("error", onErr);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain" data-testid="hero-section">
      <div className="absolute inset-0 z-0 bg-[#070B14]" />

      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <div style={rightPanelStyle}>
          <div style={videoShellStyle}>
            {videoOk ? (
              <video
                ref={videoRef}
                className="hero-video-premium"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                data-testid="hero-video"
                style={videoStyle}
              >
                <source src={HERO_VIDEO_SOURCE} type="video/mp4" />
              </video>
            ) : (
              <div
                className="hero-video-premium"
                style={{
                  ...videoStyle,
                  background:
                    "radial-gradient(ellipse 80% 60% at 60% 25%, rgba(200,169,126,0.44) 0%, rgba(200,169,126,0.16) 42%, rgba(10,15,26,0.0) 78%)",
                }}
                data-testid="hero-fallback"
              />
            )}
            <div style={hazeStyle} />
            <div style={panelGlowStyle} />
            <div style={scanlineStyle} />
            <div style={{ position: "absolute", inset: 0 }}>
              {GLITCH_BARS.map((bar, i) => (
                <div
                  key={i}
                  style={{
                    ...barBaseStyle,
                    left: bar.left,
                    width: bar.width,
                    opacity: bar.opacity,
                    transform: `translate3d(${bar.shiftX}px, ${bar.shiftY}px, 0)`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(245,241,230,0.01) 28%, rgba(200,169,126,0.10) 52%, rgba(245,241,230,0.01) 76%, rgba(255,255,255,0.05) 100%)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
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
        <div className="max-w-3xl xl:max-w-5xl flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <Wordmark size="lg" embossed className="text-ivory justify-center md:justify-start" />
          <p className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em]" data-testid="hero-acronym">
            A&nbsp;Platform&ensp;&middot;&ensp;Tracking&ensp;&middot;&ensp;Institutional&ensp;&middot;&ensp;Trends
            &ensp;&middot;&ensp;Uncovering&ensp;&middot;&ensp;Disparate&ensp;&middot;&ensp;Enforcement
          </p>
          <p className="mt-9 md:mt-10 font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug" data-testid="hero-tagline">
            Accountability Is Real<span className="text-gold">.</span>
          </p>
          <div className="w-full mt-8">
            <SearchBar />
          </div>
        </div>
      </div>

      <OregonCounter />
    </section>
  );
};
