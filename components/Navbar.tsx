"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  name?: string;
  location?: string;
  statusBadge?: string;
}

export function Navbar({
  name = "M. SHANID",
  location = "11.25°N, 75.78°E [IN]",
  statusBadge = "UHD: ACCELERATED",
}: NavbarProps = {}) {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono text-xs ${
        scrolled
          ? "bg-[#030303]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand signature */}
        <a
          href="#"
          className="group flex items-center gap-2 tracking-widest text-[#F2F2F2] hover:text-[#FFE500] transition-colors"
        >
          <span className="inline-block w-2.5 h-2.5 bg-[#FFE500] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-sm sm:text-base">
            {name}
          </span>
          <span className="text-white/40 text-[10px] hidden sm:inline-block">
            // [CORE_v1.0]
          </span>
        </a>

        {/* Center telemetry: Coordinates & Time (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-white/50 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-white/30">LOC:</span>
            <span className="text-[#F2F2F2]">{location}</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-white/30">TIME:</span>
            <span className="text-[#FFE500] font-medium">{mounted ? time : "--:--:--"} IST</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1.5 text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{statusBadge}</span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 tracking-wider">
          {[
            { label: "PROJECTS", href: "#projects" },
            { label: "ABOUT", href: "#about" },
            { label: "SKILLS", href: "#skills" },
            { label: "EXP", href: "#experiments" },
            { label: "CONTACT", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-white/70 hover:text-[#FFE500] transition-colors py-1 group"
            >
              <span className="text-white/30 group-hover:text-[#FFE500] mr-1 text-[10px]">
                /
              </span>
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#FFE500] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#contact"
            className="px-3 py-1.5 border border-[#FFE500]/60 bg-[#FFE500]/10 text-[#FFE500] hover:bg-[#FFE500] hover:text-[#030303] transition-all duration-200 uppercase font-semibold text-[11px] tracking-widest shadow-[0_0_12px_rgba(255,229,0,0.15)]"
          >
            INIT CONTACT
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <span className="text-[#FFE500] text-[10px] sm:hidden font-mono">
            {mounted ? time : ""}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-[#F2F2F2] border border-white/20 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors bg-black/40 backdrop-blur-sm"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-0.5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-opacity duration-200 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030303]/98 border-b border-[#FFE500]/30 px-6 py-6 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4 text-sm tracking-widest">
            {[
              { label: "PROJECTS", href: "#projects" },
              { label: "ABOUT", href: "#about" },
              { label: "SKILLS", href: "#skills" },
              { label: "EXPERIMENTS", href: "#experiments" },
              { label: "CONTACT", href: "#contact" },
            ].map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-white/5 text-white/80 hover:text-[#FFE500] transition-colors"
              >
                <span>
                  <span className="text-[#FFE500] mr-2">0{idx + 1} //</span>
                  {item.label}
                </span>
                <span className="text-white/30 text-xs">→</span>
              </a>
            ))}
            <div className="pt-2 flex justify-between items-center text-xs text-white/40">
              <span>LOC: IN [IST]</span>
              <span className="text-[#FFE500]">{time}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
