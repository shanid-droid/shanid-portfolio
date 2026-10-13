"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";

interface CinematicHeroProps {
  videoUrl?: string;
  tag?: string;
  name?: string;
  subtitle?: string;
}

export function CinematicHero({
  videoUrl = "/videos/hero-intro.mp4",
  tag = "Systems & XR Technologist",
  name = "Muhammed Shanid",
  subtitle = "Curiosity, made tangible.",
}: CinematicHeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Playback & Video states
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackMode, setPlaybackMode] = useState<"cinema" | "scrub">("cinema");
  const [isMuted, setIsMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState(4.0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Parallax offsets (desktop only)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Format time (mm:ss)
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  // Update video duration & metadata safely
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setVideoDuration(dur);
      }
    }
  };

  // Ensure autoplay and audio muting on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    const updateDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        setVideoDuration(video.duration);
      }
    };

    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("canplay", updateDuration);
    video.addEventListener("loadeddata", updateDuration);

    return () => {
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("canplay", updateDuration);
      video.removeEventListener("loadeddata", updateDuration);
    };
  }, []);

  // Parallax effect: subtle and hardware-friendly (Intel UHD optimized)
  useEffect(() => {
    if (shouldReduceMotion || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (e.clientX - centerX) / centerX;
      targetY = (e.clientY - centerY) / centerY;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setParallax({
        x: Number(currentX.toFixed(3)),
        y: Number(currentY.toFixed(3)),
      });
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  // Video Scroll Scrubbing Loop (safe for Intel UHD Graphics & Android)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let isSeeking = false;
    let targetTime = 0;
    let animationFrameId: number;

    const onSeeked = () => {
      isSeeking = false;
    };
    video.addEventListener("seeked", onSeeked);

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);

      if (playbackMode === "scrub") {
        const dur = video.duration || videoDuration;
        targetTime = progress * dur;
      }
    };

    const renderLoop = () => {
      if (playbackMode === "scrub" && video.readyState >= 2 && !isSeeking) {
        const diff = Math.abs(video.currentTime - targetTime);
        if (diff > 0.04) {
          isSeeking = true;
          video.currentTime = targetTime;
          setCurrentTimeDisplay(formatTime(targetTime));
        }
      } else if (playbackMode === "cinema" && video) {
        setCurrentTimeDisplay(formatTime(video.currentTime));
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("seeked", onSeeked);
      cancelAnimationFrame(animationFrameId);
    };
  }, [playbackMode, videoDuration, formatTime]);

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackMode === "scrub") {
      setPlaybackMode("cinema");
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // Switch between Scroll Scrub and Cinema Play mode
  const toggleScrubMode = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackMode === "scrub") {
      setPlaybackMode("cinema");
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setPlaybackMode("scrub");
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Cinematic staggered text entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      id="hero-track"
      aria-label="Cinematic Hero Introduction"
      className="relative w-full h-[210vh] sm:h-[240vh] bg-[#030303]"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* ========================================================================= */}
        {/* PRIMARY VIDEO LAYER: Clean, bright, centered, and unobstructed             */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#030303]">
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted={isMuted}
            loop
            autoPlay
            preload="auto"
            aria-label="Cinematic video introduction featuring Muhammed Shanid"
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.92] transition-transform duration-200"
            style={{
              transform: shouldReduceMotion
                ? "none"
                : `scale(1.03) translate3d(${parallax.x * 8}px, ${parallax.y * 8}px, 0)`,
              willChange: "transform",
            }}
          />

          {/* Gentle edge vignettes to enhance contrast while keeping center subject crisp */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-[#030303]/20 to-transparent pointer-events-none w-full sm:w-1/2" />
          
          {/* Subtle micro CRT texture */}
          <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />

          {/* Yellow rim bloom highlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#FFE500]/5 blur-[100px] pointer-events-none"
            style={{
              transform: shouldReduceMotion
                ? "translate(-50%, -50%)"
                : `translate(calc(-50% + ${parallax.x * -16}px), calc(-50% + ${parallax.y * -16}px))`,
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* TOP HUD: Minimalist Metadata & Telemetry (Accessible)                     */}
        {/* ========================================================================= */}
        <header className="relative z-10 w-full pt-20 px-6 sm:px-12 max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-white/50 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE500] animate-pulse" aria-hidden="true" />
            <span className="text-[#F2F2F2] tracking-widest text-[11px] uppercase">
              PORTFOLIO // V2026
            </span>
          </div>

          {/* Video Scrub / Status Telemetry */}
          <div
            className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/10 rounded-sm text-[11px]"
            aria-live="polite"
          >
            <span className="text-white/40">TC:</span>
            <span className="text-[#FFE500] font-mono font-medium">{currentTimeDisplay}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{formatTime(videoDuration)}</span>
            <div className="w-12 h-1 bg-white/20 hidden sm:block relative overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-[#FFE500] transition-all duration-75"
                style={{ width: `${(scrollProgress * 100).toFixed(0)}%` }}
              />
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* CINEMATIC ENTRANCE & TEXT REVEALS                                          */}
        {/* Positioned lower-left with refined scale to keep subject unblocked         */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full px-6 sm:px-12 max-w-7xl mx-auto pb-10 sm:pb-14 mt-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl space-y-4"
          >
            {/* Tag / Category Badge */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-[#FFE500]" aria-hidden="true" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#FFE500]">
                {tag}
              </span>
            </motion.div>

            {/* Name Reveal */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F2F2F2] leading-tight">
                {name.split(" ").length > 1 ? (
                  <>
                    {name.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2F2F2] via-[#F2F2F2] to-[#FFE500]">
                      {name.split(" ").slice(-1).join("")}
                    </span>
                  </>
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2F2F2] via-[#F2F2F2] to-[#FFE500]">
                    {name}
                  </span>
                )}
              </h1>
            </motion.div>

            {/* Tagline Reveal */}
            <motion.div variants={itemVariants}>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 font-light tracking-tight leading-snug">
                “{subtitle}”
              </p>
            </motion.div>

            {/* Action Link: Explore Work & About */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                aria-label="Explore Work - Jump to selected projects section"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-[#FFE500] text-[#030303] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#F2F2F2] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] shadow-[0_0_24px_rgba(255,229,0,0.35)]"
              >
                <span>Explore Work</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </a>

              <a
                href="#about"
                aria-label="Read more about Muhammed Shanid"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-black/60 border border-white/20 text-[#F2F2F2] font-mono text-xs uppercase tracking-wider hover:border-[#FFE500] hover:text-[#FFE500] backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE500]"
              >
                About Me
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACCESSIBLE CONTROLS & TIMELINE INDICATOR                           */}
        {/* ========================================================================= */}
        <footer className="relative z-10 w-full pb-6 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs select-none border-t border-white/5 pt-4">
          {/* Accessible Controls: Play/Pause, Scrub Mode, Mute */}
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md p-1 border border-white/10 rounded-sm">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause cinematic video" : "Play cinematic video"}
              className="px-3 py-1.5 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFE500]"
            >
              <span aria-hidden="true">{isPlaying ? "⏸" : "▶"}</span>
              <span className="text-[11px] uppercase">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={toggleScrubMode}
              aria-pressed={playbackMode === "scrub"}
              aria-label="Toggle scroll-scrub mode"
              className={`px-3 py-1.5 transition-colors uppercase text-[11px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFE500] ${
                playbackMode === "scrub"
                  ? "bg-[#FFE500] text-[#030303] font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
              <span>{playbackMode === "scrub" ? "Scroll Scrub Active" : "Scrub On Scroll"}</span>
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
              className="px-2.5 py-1.5 text-white/60 hover:text-[#FFE500] transition-colors text-[11px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFE500]"
            >
              {isMuted ? "Audio: Off" : "Audio: On"}
            </button>
          </div>

          {/* Interactive Scroll Cue */}
          <div className="flex items-center gap-3 text-white/50 text-[11px] tracking-wider uppercase">
            <span className="text-[#FFE500] animate-bounce" aria-hidden="true">↓</span>
            <span>Scroll To Scrub Timeline</span>
            <div className="w-16 h-1 bg-white/10 relative overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-[#FFE500] transition-all duration-100"
                style={{ width: `${Math.max(scrollProgress * 100, 8)}%` }}
              />
            </div>
          </div>
        </footer>

      </div>
    </section>
  );
}
