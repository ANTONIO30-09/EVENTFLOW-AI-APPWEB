"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number; alpha: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 40 : 90;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (initRandomY = false): Particle => ({
      x: Math.random() * canvas.width,
      y: initRandomY ? Math.random() * canvas.height : canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.5 + 0.2,
    });

    resizeCanvas();
    for (let i = 0; i < particleCount; i++) particles.push(createParticle(true));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const force = (120 - distance) / 120;
          p.x += (dx / distance) * force * 1.5;
          p.y += (dy / distance) * force * 1.5;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha})`; 
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(250, 204, 21, 0.5)";
        ctx.fill();
        ctx.restore();
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) particles[index] = createParticle(false);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resizeCanvas);
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[2]" />;
}
