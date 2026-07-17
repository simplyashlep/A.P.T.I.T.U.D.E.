import React, { useEffect, useRef, useState } from "react";
import { CursorWordmark } from "./CursorWordmark";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";
import { InteractiveGrid } from "./InteractiveGrid";

// ── Update this to match the exact filename you uploaded to /public/media/ ──
const HERO_VIDEO_SOURCE = "/media/hero-network.mp4";

const GLITCH_BARS = [
  { left: "5%",  width: "7%",   shiftY: -5, shiftX: -1, opacity: 0.1  },
  { left: "15%", width: "5%",   shiftY:  2, shiftX:  1, opacity: 0.06 },
  { left: "24%", width: "6%",   shiftY: -3, shiftX: -2, opacity: 0.08 },
  { left: "35%", width: "4.5%", shiftY:  4, shiftX:  1, opacity: 0.05 },
  { left: "44%", width: "8%",   shiftY: -2, shiftX: -1, opacity: 0.09 },
  { left: "57%", width: "5%",   shiftY:  4, shiftX:  2, opacity: 0.06 },
  { left: "66%", width: "7%",   shiftY: -1, shiftX:  0, opacity: 0.08 },
  { left: "78%", width: "6%",   shiftY:  3, shiftX: -1, opacity: 0.07 },
  { left: "87%", width: "5%",   shiftY: -4, shiftX:  1, opacity: 0.07 },
];

const rightPanelStyle = {
  position: "absolute",
  right: 0,
  top: 0,
  width: "clamp(480px, 62vw, 1100px)",
  height: "100%",
  maskImage: [
    "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 18%, black 38%, black 100%)",
    "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
  ].join(", "),
  WebkitMaskImage: [
    "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 18%, black 38%, black 100%)",
    "linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%)",
  ].join(", "),
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  overflow: "hidden",
  background: "transparent",
};

const videoShellStyle = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
};

const videoStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
  transform: "scale(1.04)",
  opacity: 0.82,
  filter: "saturate(1.1) contrast(1.15) brightness(1.05)",
  mixBlendMode: "screen",
  animation: "heroVideoFloat 52s ease-in-out infinite alternate, heroVideoBreath 24s ease-in-out infinite",
};

const tintOverlayStyle = {
  position: "absolute",
  inset: 0,
  background: [
    "radial-gradient(ellipse 55% 50% at 65% 40%, rgba(200,169,126,0.55) 0%, rgba(200,169,126,0.15) 45%, transparent 70%)",
    "radial-gradient(ellipse 90% 80% at 95% 10%,  rgba(91,123,154,0.35) 0%, transparent 55%)",
    "radial-gradient(ellipse 80% 60% at 100% 90%, rgba(91,123,154,0.25) 0%, transparent 55%)",
  ].join(", "),
  mixBlendMode: "multiply",
  pointerEvents: "none",
  zIndex: 2,
};

const panelGlowStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(120% 100% at 76% 24%, rgba(200,169,126,0.07) 0%, rgba(200,169,126,0.02) 30%, transparent 72%)",
  mixBlendMode: "screen",
  pointerEvents: "none",
  zIndex: 3,
};

const scanlineStyle = {
  position: "absolute",
  inset: 0,
  background:
    "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(200,169,126,0.008) 0 1px, transparent 1px 30px)",
  opacity: 0.25,
  pointerEvents: "none",
  zIndex: 4,
};

const hazeStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(10,15,26,0.08) 0%, transparent 15%, transparent 82%, rgba(10,15,26,0.3) 100%)",
  pointerEvents: "none",
  zIndex: 5,
};

const barBaseStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  borderRadius: 999,
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(245,241,230,0.02) 0%, rgba(200,169,126,0.08) 52%, rgba(245,241,230,0.01) 100%)",
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
      v.playbackRate = 0.68;
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
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Base dark layer */}
      <div className="absolute inset-0 z-0 bg-[#070B14]" />

      {/* Interactive grid — sits above the base, behind the video panel */}
      <InteractiveGrid />

      {/* Video panel — top-right, fades left toward center */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <div style={rightPanelStyle}>
          <div style={videoShellStyle}>
            {videoOk ? (
              <video
                ref={videoRef}
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
                style={{
                  ...videoStyle,
                  background:
                    "radial-gradient(ellipse 80% 60% at 60% 25%, rgba(200,169,126,0.4) 0%, rgba(200,169,126,0.12) 42%, rgba(10,15,26,0.0) 78%)",
                }}
                data-testid="hero-fallback"
              />
            )}
            {/* Gold + blue tint wash */}
            <div style={tintOverlayStyle} />
            <div style={hazeStyle} />
            <div style={panelGlowStyle} />
            <div style={scanlineStyle} />
            {/* Glitch bars */}
            <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
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
                  <div style={{
                    position: "absolute", inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(245,241,230,0.01) 28%, rgba(200,169,126,0.10) 52%, rgba(245,241,230,0.01) 76%, rgba(255,255,255,0.05) 100%)",
                    mixBlendMode: "screen",
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edge rule lines */}
      <div
        className="absolute left-6 md:left-10 top-24 bottom-40 w-px z-[3]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }}
      />
      <div
        className="absolute right-6 md:right-10 top-24 bottom-40 w-px z-[3]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 pt-28 pb-10">
        <div className="max-w-4xl xl:max-w-6xl flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <CursorWordmark />
          <p
            className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em]"
            data-testid="hero-acronym"
          >
            Accountability&nbsp;Pathways&ensp;&middot;&ensp;Through&ensp;&middot;&ensp;Institutional&ensp;&middot;&ensp;Transparency
            &ensp;&middot;&ensp;Understanding&ensp;&middot;&ensp;and&ensp;&middot;&ensp;Data&ensp;&middot;&ensp;Ecosystems
          </p>
          <p
            className="mt-9 md:mt-10 font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug"
            data-testid="hero-tagline"
          >
            Every public institution has a record<span className="text-gold">.</span><br />
            <span className="text-ivory-dim text-xl md:text-2xl">Now it has a mirror.</span>
          </p>
          <div className="w-full mt-8">
            <SearchBar />
          </div>
        </div>
      </div>

      <OregonCounter />

      {/* Lady Justice — ghost still, bottom-right, barely perceptible */}
      <div
        className="absolute bottom-0 right-0 z-[2] pointer-events-none select-none"
        aria-hidden="true"
        style={{
          width: "clamp(160px, 18vw, 280px)",
          maskImage: [
            "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.55) 100%)",
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)",
          ].join(", "),
          WebkitMaskImage: [
            "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.55) 100%)",
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)",
          ].join(", "),
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <img
          src="/media/lady-justice-still.png"
          alt=""
          draggable="false"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            opacity: 0.10,
            filter: "grayscale(100%) contrast(0.75) brightness(0.85) sepia(0.2)",
            mixBlendMode: "luminosity",
          }}
        />
      </div>
    </section>
  );
};
