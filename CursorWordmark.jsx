import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * CursorWordmark — the A.P.T.I.T.U.D.E. lockup, raised and 3D, with a
 * heatmap that tracks the cursor and inverts the gold to deep navy-blue.
 *
 * Three stacked layers, all rendering identical glyphs so they register
 * exactly on top of one another:
 *
 *   1. extrude — dark bronze copy with a stacked text-shadow. This is what
 *      makes the mark read as physically raised off the page.
 *   2. face    — the gold gradient surface.
 *   3. heat    — a radial "hot spot" clipped to the glyphs, painted in the
 *      inverse of gold. Fades in on hover and follows the pointer.
 *
 * Honors prefers-reduced-motion by dropping the pointer tracking and
 * holding the mark in its resting gold state.
 */

const LETTERS = "APTITUDE".split("");

const SIZES = {
  md: "text-3xl md:text-4xl tracking-[0.18em]",
  lg: "text-5xl md:text-7xl lg:text-[6.5rem] tracking-[0.16em] md:tracking-[0.20em]",
};

// Gold, and its inverse. #C8A97E inverted lands in the steel-blue family,
// which is already in the site's palette — so the hover state reads as
// intentional rather than as a foreign color.
const GOLD_FACE =
  "linear-gradient(168deg, #F2E2C4 0%, #D9BE93 22%, #C8A97E 48%, #A8895F 74%, #C8A97E 100%)";

const HEAT_FILL = (x, y) =>
  [
    `radial-gradient(circle 190px at ${x}px ${y}px,`,
    "#1B2C4F 0%,",
    "#375181 26%,",
    "#5B7B9A 46%,",
    "rgba(91,123,154,0.35) 62%,",
    "rgba(91,123,154,0) 78%)",
  ].join(" ");

export const CursorWordmark = ({
  size = "lg",
  className = "",
  showDots = true,
}) => {
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [hot, setHot] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const onMove = useCallback(
    (e) => {
      if (reduced) return;
      const el = wrapRef.current;
      if (!el) return;
      const { clientX, clientY } = e;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setPos({ x: clientX - r.left, y: clientY - r.top });
      });
    },
    [reduced]
  );

  // Every layer shares this so the glyphs land in exactly the same place
  const glyphStyle = {
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  const overlayStyle = {
    ...glyphStyle,
    position: "absolute",
    left: 0,
    top: 0,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    pointerEvents: "none",
  };

  const Glyphs = ({ dotColor }) => (
    <>
      {LETTERS.map((l, i) => (
        <span key={i}>
          {l}
          {showDots && (
            <span style={dotColor ? { color: dotColor } : undefined}>.</span>
          )}
        </span>
      ))}
    </>
  );

  const sizeCls = SIZES[size] || SIZES.lg;

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => !reduced && setHot(true)}
      onMouseLeave={() => setHot(false)}
      className={`font-display relative inline-block ${sizeCls} ${className}`}
      aria-label="A.P.T.I.T.U.D.E."
      data-testid="cursor-wordmark"
      style={{
        transform: hot ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 420ms cubic-bezier(0.23, 1, 0.32, 1)",
        cursor: "default",
      }}
    >
      {/* 1 — extrusion. In normal flow, so it defines the element's box. */}
      <span
        aria-hidden="true"
        style={{
          ...glyphStyle,
          display: "inline-block",
          color: "#6A5339",
          textShadow: [
            "0 1px 0 #7a6142",
            "0 2px 0 #6a5339",
            "0 3px 0 #5a4530",
            "0 4px 0 #4a3827",
            "0 5px 0 #3a2c1e",
            "0 7px 10px rgba(0,0,0,0.55)",
            "0 14px 28px rgba(0,0,0,0.40)",
          ].join(", "),
        }}
      >
        <Glyphs />
      </span>

      {/* 2 — gold face */}
      <span
        aria-hidden="true"
        style={{ ...overlayStyle, backgroundImage: GOLD_FACE }}
      >
        <Glyphs />
      </span>

      {/* 3 — inverse heatmap, tracking the pointer */}
      <span
        aria-hidden="true"
        data-testid="cursor-wordmark-heat"
        style={{
          ...overlayStyle,
          backgroundImage: HEAT_FILL(pos.x, pos.y),
          opacity: hot ? 1 : 0,
          transition: "opacity 260ms ease-out",
        }}
      >
        <Glyphs />
      </span>
    </div>
  );
};

export default CursorWordmark;
