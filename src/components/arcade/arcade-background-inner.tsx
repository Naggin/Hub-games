"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

export function ArcadeBackgroundInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? "#00f5ff" : "#ff00aa",
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
      />
      <div className="arcade-grid pointer-events-none fixed inset-0 z-0 opacity-40" />
    </>
  );
}

export function MarqueeTitle({ text }: { text: string }) {
  return (
    <div className="overflow-hidden border-y border-neon-cyan/20 bg-black/30 py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap font-pixel text-xs tracking-widest text-neon-cyan md:text-sm"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8 text-glow-cyan">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function InsertCoinPrompt({
  onInsert,
}: {
  onInsert: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onInsert}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className="font-pixel text-sm text-neon-gold text-glow-gold transition hover:scale-105 md:text-base"
    >
      INSERT COIN — CLIQUE OU ESPAÇO
    </motion.button>
  );
}
