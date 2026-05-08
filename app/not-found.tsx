"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Descripción: Página de error 404 con sistema solar 3D animado. Los íconos
 * de PawLig orbitan el "404" con física kepleriana real (ley de áreas) y
 * proyección 3D que produce oclusión correcta: los íconos pasan por delante
 * y por detrás del número según su posición en la órbita.
 * Requiere: Acceso público (sin autenticación).
 * Implementa: Canvas 2D, física orbital kepleriana, proyección paralela 3D.
 */

/* ── Definición de órbitas ── */
interface Orbit {
  shape: string;
  a: number;
  e: number;
  inc: number;
  lan: number;
  speed: number;
  phase: number;
  col: [number, number, number];
}

const ORBITS: Orbit[] = [
  /* ── Cinturón interno ── */
  {
    shape: "paw",
    a: 0.42,
    e: 0.28,
    inc: 22,
    lan: 0,
    speed: 1.1,
    phase: 0.0,
    col: [124, 58, 237],
  },
  {
    shape: "heart",
    a: 0.5,
    e: 0.18,
    inc: 48,
    lan: 55,
    speed: 0.9,
    phase: 1.8,
    col: [236, 72, 153],
  },
  {
    shape: "bolt",
    a: 0.46,
    e: 0.38,
    inc: 72,
    lan: 115,
    speed: 1.0,
    phase: 3.3,
    col: [234, 179, 8],
  },
  /* ── Cinturón medio ── */
  {
    shape: "bone",
    a: 0.62,
    e: 0.32,
    inc: 18,
    lan: 175,
    speed: 0.65,
    phase: 0.9,
    col: [124, 58, 237],
  },
  {
    shape: "shield",
    a: 0.68,
    e: 0.14,
    inc: 58,
    lan: 235,
    speed: 0.55,
    phase: 2.6,
    col: [20, 184, 166],
  },
  {
    shape: "star",
    a: 0.58,
    e: 0.26,
    inc: 35,
    lan: 300,
    speed: 0.72,
    phase: 4.5,
    col: [168, 85, 247],
  },
  {
    shape: "paw",
    a: 0.64,
    e: 0.4,
    inc: 78,
    lan: 40,
    speed: 0.6,
    phase: 5.8,
    col: [20, 184, 166],
  },
  /* ── Cinturón externo ── */
  {
    shape: "house",
    a: 0.8,
    e: 0.22,
    inc: 25,
    lan: 85,
    speed: 0.38,
    phase: 1.2,
    col: [249, 115, 22],
  },
  {
    shape: "heart",
    a: 0.88,
    e: 0.3,
    inc: 62,
    lan: 150,
    speed: 0.3,
    phase: 3.7,
    col: [236, 72, 153],
  },
  {
    shape: "bone",
    a: 0.76,
    e: 0.18,
    inc: 42,
    lan: 220,
    speed: 0.42,
    phase: 0.4,
    col: [249, 115, 22],
  },
  {
    shape: "star",
    a: 0.92,
    e: 0.24,
    inc: 15,
    lan: 280,
    speed: 0.25,
    phase: 2.0,
    col: [234, 179, 8],
  },
  {
    shape: "shield",
    a: 0.84,
    e: 0.35,
    inc: 68,
    lan: 340,
    speed: 0.33,
    phase: 4.9,
    col: [124, 58, 237],
  },
];

/* ── Proyección 3D → 2D ── */
function project(orb: Orbit, angle: number, cx: number, cy: number, R: number) {
  const a = orb.a * R;
  const e = orb.e;
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
  const xOrb = r * Math.cos(angle);
  const yOrb = r * Math.sin(angle);

  const incR = (orb.inc * Math.PI) / 180;
  const lanR = (orb.lan * Math.PI) / 180;

  const x1 = xOrb;
  const y1 = yOrb * Math.cos(incR);
  const z1 = yOrb * Math.sin(incR);

  const xW = x1 * Math.cos(lanR) - y1 * Math.sin(lanR);
  const yW = x1 * Math.sin(lanR) + y1 * Math.cos(lanR);

  return { sx: cx + xW, sy: cy + yW * 0.4, z: z1, dist: r };
}

/* ── Drawers de íconos ── */
type DrawFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  col: [number, number, number],
  alpha: number,
) => void;

function applyStroke(
  ctx: CanvasRenderingContext2D,
  col: [number, number, number],
  alpha: number,
) {
  const [rc, gc, bc] = col;
  ctx.strokeStyle = `rgba(${rc},${gc},${bc},${alpha})`;
}

const drawPaw: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, r * 0.12, r * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  (
    [
      [-r * 0.52, -r * 0.55],
      [r * 0.52, -r * 0.55],
      [-r * 0.85, -r * 0.12],
      [r * 0.85, -r * 0.12],
    ] as [number, number][]
  ).forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(px, py, r * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
};

const drawHeart: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.13;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = r * 0.82;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.42);
  ctx.bezierCurveTo(s, -s * 0.38, s * 1.2, -s * 0.95, 0, -s * 0.48);
  ctx.bezierCurveTo(-s * 1.2, -s * 0.95, -s, -s * 0.38, 0, s * 0.42);
  ctx.stroke();
  ctx.restore();
};

const drawBone: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.13;
  ctx.lineCap = "round";
  const len = r * 0.82;
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();
  (
    [
      [-len, -len * 0.36],
      [-len, len * 0.36],
      [len, -len * 0.36],
      [len, len * 0.36],
    ] as [number, number][]
  ).forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, r * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
};

const drawHouse: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.13;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const w = r * 0.92,
    h = r * 0.72,
    rh = r * 0.56;
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2 + rh * 0.4, w, h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-w * 0.65, -h / 2 + rh * 0.4);
  ctx.lineTo(0, -h / 2 + rh * 0.4 - rh);
  ctx.lineTo(w * 0.65, -h / 2 + rh * 0.4);
  ctx.stroke();
  ctx.restore();
};

const drawShield: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.13;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const w = r * 0.76,
    tp = r * 0.96;
  ctx.beginPath();
  ctx.moveTo(0, tp);
  ctx.bezierCurveTo(-w, tp * 0.5, -w, -tp * 0.28, 0, -tp);
  ctx.bezierCurveTo(w, -tp * 0.28, w, tp * 0.5, 0, tp);
  ctx.stroke();
  ctx.restore();
};

const drawBolt: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(r * 0.22, -r);
  ctx.lineTo(-r * 0.28, r * 0.06);
  ctx.lineTo(r * 0.16, r * 0.06);
  ctx.lineTo(-r * 0.22, r);
  ctx.stroke();
  ctx.restore();
};

const drawStar: DrawFn = (ctx, x, y, r, col, a) => {
  ctx.save();
  ctx.translate(x, y);
  applyStroke(ctx, col, a);
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a1 = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const a2 = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
    else ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    ctx.lineTo(Math.cos(a2) * r * 0.38, Math.sin(a2) * r * 0.38);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

const DRAW: Record<string, DrawFn> = {
  paw: drawPaw,
  heart: drawHeart,
  bone: drawBone,
  house: drawHouse,
  shield: drawShield,
  bolt: drawBolt,
  star: drawStar,
};

export default function NotFound() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number, cx: number, cy: number, R: number;
    let raf: number;
    const angles = ORBITS.map((o) => o.phase);

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas!.parentElement?.clientWidth || 680;
      H = Math.round(Math.min(W * 0.68, window.innerHeight * 0.68));
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.44;
    }

    function stepAngles() {
      ORBITS.forEach((orb, i) => {
        const a = orb.a * R;
        const e = orb.e;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(angles[i]));
        const h = orb.speed * a * a * Math.sqrt(1 - e * e);
        angles[i] += (h / (r * r)) * 0.016;
      });
    }

    function drawRing(orb: Orbit) {
      const a = orb.a * R;
      const b = a * Math.sqrt(1 - orb.e * orb.e);
      const incR = (orb.inc * Math.PI) / 180;
      const lanR = (orb.lan * Math.PI) / 180;
      const N = 96;
      ctx!.save();
      ctx!.strokeStyle = "rgba(124,58,237,0.07)";
      ctx!.lineWidth = 0.8;
      ctx!.setLineDash([3, 8]);
      ctx!.beginPath();
      for (let i = 0; i <= N; i++) {
        const ang = (i / N) * Math.PI * 2;
        const xO = a * Math.cos(ang);
        const yO = b * Math.sin(ang);
        const y1 = yO * Math.cos(incR);
        const xW = xO * Math.cos(lanR) - y1 * Math.sin(lanR);
        const yW = xO * Math.sin(lanR) + y1 * Math.cos(lanR);
        const sx = cx + xW;
        const sy = cy + yW * 0.4;
        if (i === 0) {
          ctx!.moveTo(sx, sy);
        } else {
          ctx!.lineTo(sx, sy);
        }
      }
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.restore();
    }

    function draw404() {
      const fs = Math.min(W * 0.22, H * 0.46, 140);
      ctx!.save();
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.font = `900 ${fs}px 'Poppins', sans-serif`;
      const g = ctx!.createLinearGradient(cx - fs * 0.8, cy, cx + fs * 0.8, cy);
      g.addColorStop(0, "#7C3AED");
      g.addColorStop(0.5, "#a855f7");
      g.addColorStop(1, "#f97316");
      ctx!.fillStyle = g;
      ctx!.shadowColor = "rgba(124,58,237,0.38)";
      ctx!.shadowBlur = fs * 0.2;
      ctx!.fillText("404", cx, cy);
      ctx!.shadowColor = "rgba(249,115,22,0.22)";
      ctx!.shadowBlur = fs * 0.14;
      ctx!.fillText("404", cx, cy);
      ctx!.shadowBlur = 0;
      ctx!.restore();
    }

    function frame() {
      ctx!.clearRect(0, 0, W, H);
      stepAngles();

      const items = ORBITS.map((orb, i) => ({
        orb,
        p: project(orb, angles[i], cx, cy, R),
      }));

      const behind = items
        .filter((it) => it.p.z <= 0)
        .sort((a, b) => a.p.z - b.p.z);
      const inFront = items
        .filter((it) => it.p.z > 0)
        .sort((a, b) => a.p.z - b.p.z);

      ORBITS.forEach(drawRing);

      behind.forEach(({ orb, p }) => {
        const depth = Math.max(0, -p.z / (orb.a * R));
        const alpha = 0.22 + (1 - depth) * 0.68;
        const scale = 0.65 + (1 - depth) * 0.35;
        const r = Math.min(W, H) * 0.034 * scale;
        DRAW[orb.shape]?.(ctx!, p.sx, p.sy, r, orb.col, alpha);
      });

      draw404();

      inFront.forEach(({ orb, p }) => {
        const depth = Math.max(0, p.z / (orb.a * R));
        const alpha = 0.7 + depth * 0.3;
        const scale = 0.82 + depth * 0.18;
        const r = Math.min(W, H) * 0.034 * scale;
        DRAW[orb.shape]?.(ctx!, p.sx, p.sy, r, orb.col, alpha);
      });

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();

    const onResize = () => {
      cancelAnimationFrame(raf);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      frame();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="flex flex-col items-center w-full overflow-hidden bg-white">
      {/* Sistema solar */}
      <div className="w-full">
        <canvas
          ref={canvasRef}
          className="block"
          style={{ willChange: "transform" }}
        />
      </div>

      {/* UI estática */}
      <div className="text-center px-6 pb-10 max-w-lg">
        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3 leading-tight">
          ¡Ups! Página no encontrada
        </h1>
        <p className="text-base text-slate-500 leading-relaxed mb-7">
          Parece que esta página se ha escapado como un{" "}
          <span className="text-purple-600 font-semibold">
            cachorro travieso
          </span>
          . ¡No te preocupes, te ayudaremos a encontrar el camino de vuelta!
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Volver atrás
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#a855f7)",
              boxShadow: "0 4px 16px rgba(124,58,237,.28)",
            }}
          >
            🏠 Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página 404 con sistema solar 3D renderizado sobre Canvas 2D. El número
 * "404" actúa como estrella central; 12 íconos de PawLig lo orbitan con
 * física kepleriana y proyección paralela 3D que produce oclusión correcta.
 *
 * Lógica Clave:
 * - Proyección 3D: cada órbita se define por semi-eje mayor (a), excentricidad
 *   (e), inclinación (inc) y longitud del nodo ascendente (lan). La posición
 *   3D se proyecta al plano XY comprimiendo el eje Y por 0.40 para dar
 *   perspectiva isométrica suave.
 * - Oclusión real: el valor z de cada ícono determina si se dibuja antes
 *   (detrás del 404) o después (por delante). El 404 se dibuja entre ambos
 *   grupos, actuando como cuerpo sólido.
 * - Ley de áreas de Kepler: dθ/dt = h/r² donde h es el momento angular
 *   específico de cada órbita, logrando mayor velocidad en el periastro.
 * - Tres cinturones: interno (a 0.42–0.50), medio (0.58–0.68) y externo
 *   (0.76–0.92) con inclinaciones y LAN distintas para máxima diferenciación.
 * - Escala y alpha por profundidad: íconos detrás del 404 son más pequeños
 *   y translúcidos; íconos enfrente son opacos y ligeramente más grandes.
 *
 * Dependencias Externas:
 * - next/navigation: useRouter para el botón "Volver atrás".
 * - next/link: navegación al inicio.
 * - React Canvas API: toda la animación se gestiona con useEffect y RAF.
 *
 */
