"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { MusicTrack } from "@/lib/types";

// Natural card variations (varied heights and offsets for rhythm)
const CARD_VARIANTS = [
  { height: 260, offsetClass: "mt-0" },
  { height: 290, offsetClass: "mt-8" },
  { height: 250, offsetClass: "mt-2" },
  { height: 300, offsetClass: "mt-12" },
  { height: 270, offsetClass: "mt-4" },
  { height: 295, offsetClass: "mt-10" },
  { height: 255, offsetClass: "mt-1" },
  { height: 285, offsetClass: "mt-7" },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SongCard({
  track,
  variant,
}: {
  track: MusicTrack;
  variant: { height: number; offsetClass: string };
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`
        group relative flex-shrink-0 w-44 sm:w-52
        bg-[#0A0A0A] border border-white/[0.08]
        rounded-2xl flex flex-col items-center justify-between
        px-4 pt-5 pb-4 select-none
        ${variant.offsetClass}
        transition-all duration-300
        hover:-translate-y-2 hover:border-[#FFE500]/40 hover:shadow-2xl hover:shadow-[#FFE500]/5
      `}
      style={{ height: `${variant.height}px` }}
    >
      {/* Portfolio HUD Corner accent on hover */}
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-transparent group-hover:border-[#FFE500]/60 transition-colors rounded-tr-2xl" />

      {/* ── Circular album artwork (centered, rounded-full) ── */}
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 mx-auto transition-transform duration-300 group-hover:scale-105"
        style={{
          border: "2px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.8)",
        }}
      >
        {track.artwork_url && !imgError ? (
          <img
            src={track.artwork_url}
            alt={`${track.title} by ${track.artist}`}
            className="w-full h-full object-cover block pointer-events-none"
            onError={() => setImgError(true)}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-black text-lg"
            style={{ background: "#141414", color: "#FFE500" }}
          >
            {track.title ? track.title[0] : "♪"}
          </div>
        )}
      </div>

      {/* ── Text info below artwork ── */}
      <div className="my-auto w-full text-center space-y-1 px-1">
        <h3
          className="text-xs sm:text-[13px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-[#F2F2F2] group-hover:text-white transition-colors"
          title={track.title}
        >
          {track.title}
        </h3>
        <p
          className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider leading-tight line-clamp-1 text-white/45 group-hover:text-white/60 transition-colors"
          title={track.artist}
        >
          {track.artist}
        </p>
      </div>

      {/* ── Track Link CTA ── */}
      {track.youtube_url ? (
        <a
          href={track.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-2 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-[#FFE500]/60 hover:text-[#FFE500] transition-colors"
          aria-label={`Play ${track.title} on Spotify`}
          onClick={(e) => e.stopPropagation()}
        >
          <PlayIcon />
          <span>PLAY</span>
        </a>
      ) : (
        <div className="mt-auto pt-2 text-[9px] font-mono text-white/20 uppercase tracking-widest">
          AUDIO
        </div>
      )}
    </div>
  );
}

// ─── CONTINUOUS INFINITE CAROUSEL ──────────────────────────────────────────────
export function MusicCarousel({ tracks }: { tracks: MusicTrack[] }) {
  // If no tracks, do not render
  if (!tracks || tracks.length === 0) return null;

  // Duplicate tracks to provide an uninterrupted infinite loop
  const CARDS = [...tracks, ...tracks];

  const trackRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const currentOffset = useRef(0);
  const halfWidth = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure half-width for seamless modulo wrapping
  const measureHalfWidth = useCallback(() => {
    if (!trackRef.current) return;
    // half of total scrollWidth corresponds to one full cycle of tracks
    halfWidth.current = trackRef.current.scrollWidth / 2;
  }, []);

  useEffect(() => {
    measureHalfWidth();
    window.addEventListener("resize", measureHalfWidth);
    return () => window.removeEventListener("resize", measureHalfWidth);
  }, [measureHalfWidth, tracks]);

  // Animation loop with requestAnimationFrame for 60fps/120fps hardware acceleration
  useEffect(() => {
    if (prefersReduced) return;

    const speed = 0.75; // Pixels per frame

    const loop = () => {
      if (!isHovered.current && !isPointerDown.current) {
        currentOffset.current += speed;

        if (halfWidth.current > 0) {
          if (currentOffset.current >= halfWidth.current) {
            currentOffset.current -= halfWidth.current;
          } else if (currentOffset.current < 0) {
            currentOffset.current += halfWidth.current;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-currentOffset.current}px, 0, 0)`;
        }
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [prefersReduced]);

  // Touch and mouse drag handlers
  const handlePointerDown = (clientX: number) => {
    isPointerDown.current = true;
    startX.current = clientX;
    startOffset.current = currentOffset.current;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDown.current) return;
    const delta = startX.current - clientX;
    let nextOffset = startOffset.current + delta;

    if (halfWidth.current > 0) {
      while (nextOffset >= halfWidth.current) nextOffset -= halfWidth.current;
      while (nextOffset < 0) nextOffset += halfWidth.current;
    }

    currentOffset.current = nextOffset;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-currentOffset.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  // Wheel horizontal scrolling (trackpad / shift+wheel)
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 0 || (e.shiftKey && Math.abs(e.deltaY) > 0)) {
      const delta = e.deltaX || e.deltaY;
      let nextOffset = currentOffset.current + delta;

      if (halfWidth.current > 0) {
        while (nextOffset >= halfWidth.current) nextOffset -= halfWidth.current;
        while (nextOffset < 0) nextOffset += halfWidth.current;
      }

      currentOffset.current = nextOffset;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-currentOffset.current}px, 0, 0)`;
      }
    }
  };

  return (
    <section
      id="music"
      className="py-24 border-t border-white/5 overflow-hidden bg-[#030303] text-[#F2F2F2]"
      aria-label="Music Playlist"
    >
      {/* ── Section Header (Preserves portfolio design system & identity) ── */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
              <span>07.5 // SOUND ARCHIVE</span>
              <span className="w-1.5 h-1.5 bg-[#FFE500]" />
              <span>PLAYLIST</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
              CURATED SOUNDTRACK
            </h2>
          </div>
          <p className="text-xs font-mono text-white/50 max-w-xs leading-relaxed">
            Directly from Shanid&apos;s personal playlist. Heavy rotation during architecture &amp; deep-focus sessions.
          </p>
        </div>
      </div>

      {/* ── Continuously scrolling carousel ── */}
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none py-6 min-h-[360px] flex items-center"
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => {
          isHovered.current = false;
          isPointerDown.current = false;
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        onWheel={handleWheel}
        role="region"
        aria-label="Interactive scrolling playlist"
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 px-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {CARDS.map((track, i) => (
            <SongCard
              key={`${track.id}-${i}`}
              track={track}
              variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
