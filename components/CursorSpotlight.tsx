"use client";

import { useEffect, useState } from "react";

export function CursorSpotlight() {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    let rafId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Lightweight lerp for butter-smooth movement on Intel UHD
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      document.documentElement.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`);

      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted || isTouchDevice) return null;

  return (
    <div
      aria-hidden="true"
      className="cursor-ambient-light fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
    />
  );
}
