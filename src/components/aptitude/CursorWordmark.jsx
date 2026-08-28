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
 * The leading A is the photographed gold mark. The photo has no alpha
 * channel (its background is baked-in charcoal), so it is used purely as a
 * luminance mask — the dark backing drops away and only the letter's
 * silhouette survives. That silhouette is then painted with the exact same
 * extrusion stack, gold face, and heat fill as the text glyphs, so the A
 * reads as part of the same word rather than a sticker on top of it.
 *
 * Honors prefers-reduced-motion by dropping the pointer tracking and
 * holding the mark in its resting gold state.
 */

const LETTERS = "PTITUDE".split("");

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

// The photo's charcoal backdrop is opaque, so it must be cut away with a
// luminance mask — near-black pixels become transparent, the gold letter
// stays. Applied identically in every layer so all three silhouettes
// register perfectly.
const MARK_MASK = {
  WebkitMaskImage: "url(/media/aptitude-a.png)",
  maskImage: "url(/media/aptitude-a.png)",
  WebkitMaskMode: "luminance",
  maskMode: "luminance",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
};

// Mirrors the extrusion the text letters get from their stacked text-shadow.
const MARK_EXTRUDE = [
  "drop-shadow(0 1px 0 #7a6142)",
  "drop-shadow(0 2px 0 #6a5339)",
  "drop-shadow(0 3px 0 #5a4530)",
  "drop-shadow(0 4px 0 #4a3827)",
  "drop-shadow(0 5px 0 #3a2c1e)",
  "drop-shadow(0 7px 10px rgba(0,0,0,0.55))",
  "drop-shadow(0 14px 28px rgba(0,0,0,0.40))",
].join(" ");

// The slot is an invisible inline box that reserves the A's space in every
// layer, so the glyphs never shift between layers. Each layer paints its own
// masked copy of the A inside it.
//
// Geometry is tuned so the photographed A lands exactly on the letters'
// baseline with the same cap height as the neighboring glyphs:
//   - the letter's ink occupies 22.6%..74.3% of the photo's height, so a
//     1.376em-tall slot makes the ink 0.71em tall (Playfair's cap height);
//   - the ink ends 25.7% up from the slot's bottom, so vertical-align
//     -0.354em parks the slot's bottom that far below the baseline;
//   - the ink ends at 79.7% of the slot's width, so the negative right
//     margin pulls the next glyph back to normal letter-spacing distance.
const SLOT_STYLE = {
  display: "inline-flex",
  width: "1.376em",
  height: "1.376em",
  marginRight: "-0.119em",
  verticalAlign: "-0.354em",
  overflow: "hidden",
  position: "relative",
  flexShrink: 0,
};

const FILL_STYLE = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  ...MARK_MASK,
};

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

  // One masked copy of the A per layer:
  //   extrude — the photo itself, carved by the mask, wearing the same
  //             stacked shadows as the bronze letters beneath them.
  //   face    — the shared gold gradient, clipped to the same silhouette.
  //   heat    — the pointer-following inverse fill, clipped to the same
  //             silhouette, so the A heats up with the rest of the word.
  const MarkSlot = ({ variant }) => (
    <span aria-hidden="true" style={SLOT_STYLE}>
      {variant === "extrude" ? (
        <img
          src="/media/aptitude-a.png"
          alt=""
          draggable="false"
          style={{ ...FILL_STYLE, objectFit: "cover", filter: MARK_EXTRUDE }}
        />
      ) : variant === "face" ? (
        <span
          className="aptitude-mark"
          style={{ ...FILL_STYLE, backgroundImage: GOLD_FACE }}
        />
      ) : (
        <span
          style={{ ...FILL_STYLE, backgroundImage: HEAT_FILL(pos.x, pos.y) }}
        />
      )}
    </span>
  );

  const Glyphs = () => (
    <>
      <MarkSlot variant="extrude" />
      {LETTERS.map((l, i) => (
        <span key={i}>
          {l}
          {showDots && <span>.</span>}
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
        <MarkSlot variant="face" />
        {LETTERS.map((l, i) => (
          <span key={i}>
            {l}
            {showDots && <span>.</span>}
          </span>
        ))}
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
        <MarkSlot variant="heat" />
        {LETTERS.map((l, i) => (
          <span key={i}>
            {l}
            {showDots && <span>.</span>}
          </span>
        ))}
      </span>
    </div>
  );
};

export default CursorWordmark;
