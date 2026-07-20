import React from "react";

/**
 * Marquee — a single continuous scrolling row.
 *
 * Deliberately restrained: one row, one direction, one speed. Motion here is
 * meant to relieve crowding, not to compete with the search bar for attention.
 * Two of these running opposite directions is the ceiling before the page
 * starts to feel busy.
 *
 * The track is rendered twice and translated by exactly -50%, which makes the
 * loop seamless with no visible reset.
 *
 * Pauses on hover, and freezes entirely under prefers-reduced-motion.
 */

let injected = false;
const injectKeyframes = () => {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-apt-marquee", "");
  el.textContent = `
    @keyframes aptMarqueeLeft  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
    @keyframes aptMarqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
    .apt-marquee { position: relative; overflow: hidden; width: 100%; }
    .apt-marquee-track {
      display: inline-flex;
      align-items: baseline;
      white-space: nowrap;
      will-change: transform;
    }
    .apt-marquee:hover .apt-marquee-track { animation-play-state: paused; }
    @media (prefers-reduced-motion: reduce) {
      .apt-marquee-track { animation: none !important; transform: none !important; }
      .apt-marquee { overflow-x: auto; }
    }
  `;
  document.head.appendChild(el);
};

export const Marquee = ({
  items = [],
  direction = "left",
  /** seconds for one full pass — higher is slower */
  duration = 48,
  gap = "3.5rem",
  className = "",
  fade = true,
  renderItem,
}) => {
  injectKeyframes();

  if (!items.length) return null;

  // Rendered twice so the -50% translation lands exactly on a repeat
  const sequence = [...items, ...items];

  return (
    <div
      className={`apt-marquee ${className}`}
      aria-hidden="true"
      data-testid="marquee"
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
            }
          : undefined
      }
    >
      <div
        className="apt-marquee-track"
        style={{
          gap,
          paddingRight: gap,
          animation: `${
            direction === "right" ? "aptMarqueeRight" : "aptMarqueeLeft"
          } ${duration}s linear infinite`,
        }}
      >
        {sequence.map((item, i) => (
          <span key={i} style={{ flexShrink: 0 }}>
            {renderItem ? renderItem(item, i % items.length) : item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
