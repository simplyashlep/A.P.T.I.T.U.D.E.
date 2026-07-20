import React, { useEffect, useRef } from "react";

/**
 * InteractiveGrid — a canvas grid that lights up gold under the cursor.
 *
 * No dependencies. Renders pointer-events:none so it never intercepts clicks.
 *
 * variant:
 *   "hero"    — screen blend, so the grid melds into the hero video's light
 *               instead of sitting on top of it as a separate plane.
 *   "section" — normal blend over the deep navy page background.
 *
 * Honors prefers-reduced-motion: the grid still renders, but the cursor
 * glow and its animation loop are skipped entirely.
 */
export const InteractiveGrid = ({
  cellSize = 52,
  opacity = 0.4,
  variant = "hero",
  glowRadius = 190,
  className = "",
  style = {},
}) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    x: -9999,
    y: -9999,
    glow: 0,
    target: 0,
    w: 0,
    h: 0,
    raf: 0,
    running: false,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = stateRef.current;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Resting grid: cool steel, barely there. Gold is reserved for the glow.
    const REST_LINE = "rgba(140,170,205,0.16)";
    const GOLD = "200,169,126";

    const drawRestingGrid = () => {
      const { w, h } = st;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = REST_LINE;
      ctx.beginPath();
      for (let gx = 0; gx <= w; gx += cellSize) {
        const px = Math.floor(gx) + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }
      for (let gy = 0; gy <= h; gy += cellSize) {
        const py = Math.floor(gy) + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }
      ctx.stroke();
    };

    const drawGlow = () => {
      const { w, h, x, y, glow } = st;
      if (glow <= 0.01) return;

      const R = glowRadius;

      // Soft gold bloom behind the lines
      const bloom = ctx.createRadialGradient(x, y, 0, x, y, R);
      bloom.addColorStop(0, `rgba(${GOLD},${0.10 * glow})`);
      bloom.addColorStop(0.55, `rgba(${GOLD},${0.035 * glow})`);
      bloom.addColorStop(1, `rgba(${GOLD},0)`);
      ctx.fillStyle = bloom;
      ctx.fillRect(x - R, y - R, R * 2, R * 2);

      const maxA = 0.55 * glow;
      ctx.lineWidth = 1;

      // Vertical lines within reach of the cursor.
      // Each gets a gradient along its length so the falloff reads as
      // radial rather than as a plus-shaped cross.
      const vStart = Math.floor((x - R) / cellSize) * cellSize;
      const vEnd = Math.ceil((x + R) / cellSize) * cellSize;
      for (let gx = vStart; gx <= vEnd; gx += cellSize) {
        if (gx < 0 || gx > w) continue;
        const dx = Math.abs(gx - x);
        if (dx >= R) continue;
        const half = Math.sqrt(R * R - dx * dx);
        const a = (1 - dx / R) * maxA;
        const g = ctx.createLinearGradient(0, y - half, 0, y + half);
        g.addColorStop(0, `rgba(${GOLD},0)`);
        g.addColorStop(0.5, `rgba(${GOLD},${a})`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.strokeStyle = g;
        ctx.beginPath();
        const px = Math.floor(gx) + 0.5;
        ctx.moveTo(px, Math.max(0, y - half));
        ctx.lineTo(px, Math.min(h, y + half));
        ctx.stroke();
      }

      // Horizontal lines, same treatment
      const hStart = Math.floor((y - R) / cellSize) * cellSize;
      const hEnd = Math.ceil((y + R) / cellSize) * cellSize;
      for (let gy = hStart; gy <= hEnd; gy += cellSize) {
        if (gy < 0 || gy > h) continue;
        const dy = Math.abs(gy - y);
        if (dy >= R) continue;
        const half = Math.sqrt(R * R - dy * dy);
        const a = (1 - dy / R) * maxA;
        const g = ctx.createLinearGradient(x - half, 0, x + half, 0);
        g.addColorStop(0, `rgba(${GOLD},0)`);
        g.addColorStop(0.5, `rgba(${GOLD},${a})`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.strokeStyle = g;
        ctx.beginPath();
        const py = Math.floor(gy) + 0.5;
        ctx.moveTo(Math.max(0, x - half), py);
        ctx.lineTo(Math.min(w, x + half), py);
        ctx.stroke();
      }

      // Intersection nodes — the detail that makes it feel like a lattice
      const nodeR = R * 0.62;
      for (let gx = vStart; gx <= vEnd; gx += cellSize) {
        if (gx < 0 || gx > w) continue;
        for (let gy = hStart; gy <= hEnd; gy += cellSize) {
          if (gy < 0 || gy > h) continue;
          const d = Math.hypot(gx - x, gy - y);
          if (d >= nodeR) continue;
          const a = (1 - d / nodeR) * 0.85 * glow;
          ctx.fillStyle = `rgba(${GOLD},${a})`;
          ctx.beginPath();
          ctx.arc(gx, gy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const render = () => {
      if (!st.w || !st.h) return;
      drawRestingGrid();
      if (!reduced) drawGlow();
    };

    const tick = () => {
      // Ease the glow toward its target so entering/leaving is never abrupt
      const diff = st.target - st.glow;
      st.glow += diff * 0.12;
      if (Math.abs(diff) < 0.005) st.glow = st.target;

      render();

      if (st.glow > 0.01 || st.target > 0.01) {
        st.raf = requestAnimationFrame(tick);
      } else {
        st.running = false;
        st.raf = 0;
        render(); // settle on a clean resting grid
      }
    };

    const start = () => {
      if (st.running || reduced) return;
      st.running = true;
      st.raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = rect.width;
      st.h = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const onPointerMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      const inside = lx >= 0 && ly >= 0 && lx <= rect.width && ly <= rect.height;
      st.x = lx;
      st.y = ly;
      st.target = inside ? 1 : 0;
      if (inside) start();
    };

    const onPointerLeave = () => {
      st.target = 0;
      start();
    };

    resize();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(wrap);
    else window.addEventListener("resize", resize);

    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.running = false;
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [cellSize, glowRadius]);

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      data-testid="interactive-grid"
      style={{
        zIndex: 0,
        opacity,
        mixBlendMode: variant === "hero" ? "screen" : "normal",
        // Fade the lattice out at the edges so it never ends in a hard seam
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 45%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 100% 100% at 50% 45%, black 55%, transparent 100%)",
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default InteractiveGrid;
