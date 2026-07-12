import React, { useEffect, useRef, useState } from "react";

const parseColor = (c, cache) => {
  if (cache[c]) return cache[c];
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = c;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  const rgb = [d[0], d[1], d[2]];
  cache[c] = rgb;
  return rgb;
};

const lerpColor = (colorA, colorB, t, cache) => {
  const a = parseColor(colorA, cache);
  const b = parseColor(colorB, cache);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
};

const MAX_DOTS = 900;

/**
 * A grid of dots that repel/attract from the cursor, with a color
 * gradient toward `activeColor` near the pointer. Ported from a Framer
 * component — no framer/framer-motion dependency, plain refs + rAF.
 */
export default function MagneticGrid({
  dotColor = "#C8A97E",
  activeColor = "#F5E9D2",
  bgColor = "transparent",
  dotSize = 3,
  dotSpacing = 26,
  influenceRadius = 120,
  attractMode = false,
  maxDisplace = 10,
  mobileCutoff = 768,
  dotOpacity = 0.4,
  className = "",
  style = {},
}) {
  const wrapperRef = useRef(null);
  const dotElsRef = useRef([]);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const colorCacheRef = useRef({});
  const [dots, setDots] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < mobileCutoff
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < mobileCutoff);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileCutoff]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) continue;

        let spacing = dotSpacing;
        const rawCount = Math.ceil(width / spacing) * Math.ceil(height / spacing);
        if (rawCount > MAX_DOTS) {
          spacing = Math.ceil(Math.sqrt((width * height) / MAX_DOTS));
        }
        const cols = Math.floor(width / spacing);
        const rows = Math.floor(height / spacing);
        const offsetX = (width - cols * spacing) / 2;
        const offsetY = (height - rows * spacing) / 2;

        const next = [];
        for (let r = 0; r <= rows; r++) {
          for (let c = 0; c <= cols; c++) {
            next.push({ id: `${r}-${c}`, baseX: offsetX + c * spacing, baseY: offsetY + r * spacing });
          }
        }
        setDots(next);
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [dotSpacing]);

  useEffect(() => {
    dotElsRef.current = dotElsRef.current.slice(0, dots.length);
  }, [dots]);

  useEffect(() => {
    if (isMobile || dots.length === 0) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      cursorRef.current.x = e.clientX - rect.left;
      cursorRef.current.y = e.clientY - rect.top;
    };
    const handleLeave = () => {
      cursorRef.current.x = -9999;
      cursorRef.current.y = -9999;
    };
    wrapper.addEventListener("mousemove", handleMove);
    wrapper.addEventListener("mouseleave", handleLeave);

    const loop = () => {
      const cx = cursorRef.current.x;
      const cy = cursorRef.current.y;

      dots.forEach((dot, i) => {
        const el = dotElsRef.current[i];
        if (!el) return;

        const dx = dot.baseX - cx;
        const dy = dot.baseY - cy;
        const dist = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - dist / influenceRadius);

        let targetX = 0;
        let targetY = 0;
        if (proximity > 0 && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const dir = attractMode ? -1 : 1;
          targetX = dir * nx * proximity * maxDisplace;
          targetY = dir * ny * proximity * maxDisplace;
        }

        const state = el._magnetState || (el._magnetState = { x: 0, y: 0 });
        state.x += (targetX - state.x) * 0.18;
        state.y += (targetY - state.y) * 0.18;

        const scale = 1 + proximity;
        const color = proximity > 0.01
          ? lerpColor(dotColor, activeColor, proximity, colorCacheRef.current)
          : dotColor;

        el.style.transform = `translate(${state.x}px, ${state.y}px) scale(${scale})`;
        el.style.backgroundColor = color;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      wrapper.removeEventListener("mousemove", handleMove);
      wrapper.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dots, isMobile, influenceRadius, attractMode, maxDisplace, dotColor, activeColor]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: bgColor,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {dots.map((dot, i) => (
        <div
          key={dot.id}
          ref={(el) => (dotElsRef.current[i] = el)}
          style={{
            position: "absolute",
            left: dot.baseX - dotSize / 2,
            top: dot.baseY - dotSize / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: dotColor,
            opacity: dotOpacity,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
