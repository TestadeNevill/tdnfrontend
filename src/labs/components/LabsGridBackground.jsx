import { useEffect, useRef } from "react";

const CELL = 28;
const INNER_R = 7;
const MID_R = 14;
const MAX_LIFT = 11;
const MAX_DIP = 5;
const LINE = "rgba(5, 150, 105, 0.09)";
const LINE_ACTIVE = "rgba(5, 150, 105, 0.115)";
const GLOW = "rgba(16, 185, 129, 0.14)";
const GLOW_ACTIVE = "rgba(16, 185, 129, 0.17)";
const GLOW_MID = "rgba(16, 185, 129, 0.06)";
const LERP = 0.14;
const REST_X = 0.5;
const REST_Y = 0.32;

function innerProfile(dist) {
  if (dist > INNER_R) return 0;

  const peak = Math.exp(-(dist * dist) / 0.9);
  const valley = -0.44 * Math.exp(-((dist - 3) ** 2) / 1.5);
  const rim = 0.13 * Math.exp(-((dist - (INNER_R - 0.55)) ** 2) / 1.6);

  let h = peak + valley + rim;

  if (dist > INNER_R - 0.85) {
    h *= (INNER_R - dist) / 0.85;
  }

  return h;
}

function rippleWave(dist, time, speed, spacing) {
  const phase = dist * spacing - time * speed;
  return (
    Math.sin(phase) * 0.62 +
    Math.sin(phase * 2.05 + 0.7) * 0.22 +
    Math.sin(phase * 0.48 - 1.2) * 0.1
  );
}

function cellElevation(dist, time, intensity) {
  const wave = rippleWave(dist, time, 2.4, 0.9);

  if (dist <= INNER_R) {
    const profile = innerProfile(dist);
    const blend = 1 - Math.max(0, (dist - (INNER_R - 1.5)) / 1.5) * 0.25;
    return (profile + wave * 0.48 * blend) * intensity;
  }

  if (dist <= MID_R) {
    const ring = (dist - INNER_R) / (MID_R - INNER_R);
    const fade = 1 - ring * 0.55;
    return wave * 0.34 * fade * intensity;
  }

  const farWave = rippleWave(dist, time, 1.05, 0.38);
  const ambient = Math.sin(dist * 0.22 - time * 0.65) * 0.14;
  return (farWave * 0.11 + ambient * 0.06) * intensity;
}

function drawCell(ctx, cx, cy, elev, active) {
  const stroke = active ? LINE_ACTIVE : LINE;

  if (Math.abs(elev) < 0.012) {
    ctx.strokeStyle = stroke;
    ctx.strokeRect(cx + 0.5, cy + 0.5, CELL - 1, CELL - 1);
    return;
  }

  if (elev > 0) {
    const lift = elev * MAX_LIFT;
    const top = cy - lift;
    const shade = 0.05 + elev * 0.09;

    ctx.fillStyle = `rgba(4, 120, 87, ${shade})`;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + CELL);
    ctx.lineTo(cx, top + CELL);
    ctx.lineTo(cx, top);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy + CELL);
    ctx.lineTo(cx + CELL, cy + CELL);
    ctx.lineTo(cx + CELL, top + CELL);
    ctx.lineTo(cx, top + CELL);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(16, 185, 129, ${0.025 + elev * 0.11})`;
    ctx.fillRect(cx, top, CELL, CELL);

    ctx.strokeStyle = stroke;
    ctx.strokeRect(cx + 0.5, top + 0.5, CELL - 1, CELL - 1);
    return;
  }

  const dip = Math.abs(elev) * MAX_DIP;
  const top = cy + dip * 0.35;

  ctx.fillStyle = `rgba(4, 120, 87, ${0.03 + Math.abs(elev) * 0.05})`;
  ctx.fillRect(cx + 1, top + 1, CELL - 2, CELL - 2);

  ctx.strokeStyle = `rgba(5, 150, 105, ${0.07 + Math.abs(elev) * 0.04})`;
  ctx.strokeRect(cx + 0.5, top + 0.5, CELL - 1, CELL - 1);
}

function drawGrid(ctx, width, height, mx, my, time, intensity, active) {
  ctx.clearRect(0, 0, width, height);

  const innerGlow = ctx.createRadialGradient(
    mx,
    my,
    0,
    mx,
    my,
    INNER_R * CELL * 1.1,
  );
  innerGlow.addColorStop(0, active ? GLOW_ACTIVE : GLOW);
  innerGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = innerGlow;
  ctx.fillRect(0, 0, width, height);

  const midGlow = ctx.createRadialGradient(
    mx,
    my,
    INNER_R * CELL * 0.7,
    mx,
    my,
    MID_R * CELL * 1.05,
  );
  midGlow.addColorStop(0, active ? GLOW_MID : "rgba(16, 185, 129, 0.04)");
  midGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = midGlow;
  ctx.fillRect(0, 0, width, height);

  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const cells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = col * CELL;
      const cy = row * CELL;
      const dist =
        Math.hypot(cx + CELL * 0.5 - mx, cy + CELL * 0.5 - my) / CELL;
      const elev = cellElevation(dist, time, intensity);
      cells.push({ cx, cy, elev });
    }
  }

  cells.sort((a, b) => a.elev - b.elev);

  for (const cell of cells) {
    drawCell(ctx, cell.cx, cell.cy, cell.elev, active);
  }
}

function drawStaticGrid(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += CELL) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }
}

export function LabsGridBackground({ active, pointerRef, requestFrameRef }) {
  const canvasRef = useRef(null);
  const smoothRef = useRef({ x: REST_X, y: REST_Y, intensity: 1 });
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return undefined;

    const ctx = canvas.getContext("2d");
    if (ctx == null) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    const startTime = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent == null) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now) => {
      if (reducedMotion) {
        drawStaticGrid(ctx, width, height);
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(frame);

      const smooth = smoothRef.current;
      const isActive = activeRef.current;
      const targetIntensity = isActive ? 1.15 : 1;
      smooth.intensity += (targetIntensity - smooth.intensity) * LERP;

      const pointer = pointerRef.current;
      const targetX = pointer?.x ?? REST_X;
      const targetY = pointer?.y ?? REST_Y;
      smooth.x += (targetX - smooth.x) * LERP;
      smooth.y += (targetY - smooth.y) * LERP;

      const time = (now - startTime) / 1000;

      drawGrid(
        ctx,
        width,
        height,
        smooth.x * width,
        smooth.y * height,
        time,
        smooth.intensity,
        isActive,
      );
    };

    const scheduleFrame = () => {
      if (rafId === 0) rafId = requestAnimationFrame(frame);
    };

    if (requestFrameRef != null) {
      requestFrameRef.current = scheduleFrame;
    }

    resize();
    scheduleFrame();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas.parentElement);

    return () => {
      ro.disconnect();
      if (rafId !== 0) cancelAnimationFrame(rafId);
      if (requestFrameRef != null) requestFrameRef.current = null;
    };
  }, [pointerRef, requestFrameRef]);

  return (
    <canvas
      ref={canvasRef}
      className="labs-grid-canvas"
      aria-hidden="true"
    />
  );
}
