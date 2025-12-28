"use client";

import { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  density: number;
  speed: number;
}

const Snowfall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const mp = 50; // max particles
    const particles: Snowflake[] = [];

    for (let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 4 + 1,
        density: Math.random() * mp,
        speed: Math.random() * 1 + 0.5,
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    let angle = 0;
    const update = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        p.y += Math.cos(angle + p.density) + 1 + p.radius / 2;
        p.x += Math.sin(angle) * 2;

        if (p.x > w + 5 || p.x < -5 || p.y > h) {
          if (i % 3 > 0) {
            particles[i] = {
              x: Math.random() * w,
              y: -10,
              radius: p.radius,
              density: p.density,
              speed: p.speed,
            };
          } else {
            if (Math.sin(angle) > 0) {
              particles[i] = {
                x: -5,
                y: Math.random() * h,
                radius: p.radius,
                density: p.density,
                speed: p.speed,
              };
            } else {
              particles[i] = {
                x: w + 5,
                y: Math.random() * h,
                radius: p.radius,
                density: p.density,
                speed: p.speed,
              };
            }
          }
        }
      }
    };

    draw();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default Snowfall;
