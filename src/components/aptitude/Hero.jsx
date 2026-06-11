import React, { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Brand";
import { SearchBar } from "./SearchBar";
import { OregonCounter } from "./OregonCounter";

const HERO_VIDEO_SOURCES = ["/media/media/blj.mp4"];

const HERO_WINDOWS = [
  { kind: "circle", cx: 0.15, cy: 0.22, r: 0.11 },
  { kind: "rect", x: 0.28, y: 0.10, w: 0.18, h: 0.12, rx: 0.035 },
  { kind: "circle", cx: 0.57, cy: 0.18, r: 0.10 },
  { kind: "polygon", points: [[0.74, 0.12], [0.87, 0.20], [0.87, 0.34], [0.74, 0.42], [0.62, 0.34], [0.62, 0.20]] },
  { kind: "polygon", points: [[0.18, 0.56], [0.30, 0.46], [0.42, 0.56], [0.30, 0.68]] },
  { kind: "polygon", points: [[0.52, 0.54], [0.63, 0.43], [0.76, 0.49], [0.79, 0.66], [0.67, 0.78], [0.55, 0.70]] },
  { kind: "rect", x: 0.08, y: 0.78, w: 0.20, h: 0.09, rx: 0.035 },
  { kind: "rect", x: 0.76, y: 0.77, w: 0.16, h: 0.09, rx: 0.035 },
];

const ClipWindow = ({ shape, scale = 1 }) => {
  switch (shape.kind) {
    case "circle":
      return <circle cx={shape.cx * scale} cy={shape.cy * scale} r={shape.r * scale} />;
    case "rect":
      return (
        <rect
          x={shape.x * scale}
          y={shape.y * scale}
          width={shape.w * scale}
          height={shape.h * scale}
          rx={(shape.rx || 0) * scale}
        />
      );
    case "polygon":
      return <polygon points={shape.points.map(([x, y]) => `${x * scale},${y * scale}`).join(" ")} />;
    default:
      return null;
  }
};

export const Hero = () => {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [srcIdx, setSrcIdx] = useState(0);

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

    v.addEventListener("error", onErr);
    v.addEventListener("canplay", tryPlay);
    tryPlay();

    return () => {
      v.removeEventListener("error", onErr);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [srcIdx]);

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col w-full overflow-hidden grain" data-testid="hero-section">
      <div className="absolute inset-0 z-0 bg-[#070B14]" />

      <div className="absolute inset-0 z-[1] hero-justice-frame" aria-hidden="true">
        <svg className="hero-justice-clip" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="aptitudeWordClip" clipPathUnits="objectBoundingBox">
              {HERO_WINDOWS.map((shape, i) => (
                <ClipWindow key={i} shape={shape} />
              ))}
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

        <div className="absolute inset-0 z-[2] pointer-events-none opacity-40 mix-blend-screen">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="rgba(200,169,126,0.28)" strokeWidth="10" vectorEffect="non-scaling-stroke">
              {HERO_WINDOWS.map((shape, i) => (
                <ClipWindow key={i} shape={shape} scale={1000} />
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute left-6 md:left-10 top-24 bottom-40 w-px z-[3]" style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }} />
      <div className="absolute right-6 md:right-10 top-24 bottom-40 w-px z-[3]" style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,126,0.22) 25%, rgba(200,169,126,0.22) 75%, transparent)" }} />

      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 pt-28 pb-10">
        <div className="max-w-3xl xl:max-w-4xl flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <Wordmark size="lg" embossed className="text-ivory justify-center md:justify-start" />
          <p className="mt-6 md:mt-7 font-serif-h italic text-[13px] md:text-base text-ivory-dim tracking-[0.06em]" data-testid="hero-acronym">
            A&nbsp;Platform&ensp;&middot;&ensp;Tracking&ensp;&middot;&ensp;Institutional&ensp;&middot;&ensp;Trends
            &ensp;&middot;&ensp;Uncovering&ensp;&middot;&ensp;Disparate&ensp;&middot;&ensp;Enforcement
          </p>
          <p className="mt-9 md:mt-10 font-serif-h text-2xl md:text-3xl text-ivory italic leading-snug" data-testid="hero-tagline">
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
