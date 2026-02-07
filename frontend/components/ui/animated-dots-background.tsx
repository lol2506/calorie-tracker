"use client";

import { useEffect, useState, useRef } from "react";

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeSpeed: number;
  fadeDirection: number;
  parallaxFactor: number;
}

export function AnimatedDotsBackground() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random dots
    const generateDots = () => {
      const newDots: Dot[] = [];
      const count = 250;
      
      for (let i = 0; i < count; i++) {
        newDots.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 200,
          size: 3 + Math.random() * 6,
          opacity: 0.08 + Math.random() * 0.18,
          fadeSpeed: 0.002 + Math.random() * 0.004,
          fadeDirection: Math.random() > 0.5 ? 1 : -1,
          parallaxFactor: 0.02 + Math.random() * 0.08,
        });
      }
      return newDots;
    };

    setDots(generateDots());
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) =>
        prevDots.map((dot) => {
          let newOpacity = dot.opacity + dot.fadeSpeed * dot.fadeDirection;
          let newDirection = dot.fadeDirection;

          if (newOpacity >= 0.25) {
            newOpacity = 0.25;
            newDirection = -1;
          } else if (newOpacity <= 0.04) {
            newOpacity = 0.04;
            newDirection = 1;
          }

          return {
            ...dot,
            opacity: newOpacity,
            fadeDirection: newDirection,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {dots.map((dot) => {
        const parallaxOffset = scrollY * dot.parallaxFactor;
        return (
          <div
            key={dot.id}
            className="absolute rounded-full bg-foreground"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              transform: `translateY(${parallaxOffset}px)`,
              transition: "opacity 0.3s ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
