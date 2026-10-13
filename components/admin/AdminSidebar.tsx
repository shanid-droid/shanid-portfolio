"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAdminAction } from "@/lib/actions";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Site & Hero", href: "/admin/settings" },
  { label: "Projects & Demos", href: "/admin/projects" },
  { label: "Skills & Toolstack", href: "/admin/skills" },
  { label: "Education & Certs", href: "/admin/education" },
  { label: "Participation", href: "/admin/participations" },
  { label: "Experiments & Ideas", href: "/admin/experiments" },
  { label: "Interests & Memories", href: "/admin/interests" },
  { label: "Playlist / Music", href: "/admin/music" },
  { label: "Contact Inquiries", href: "/admin/messages" },
];

export function AdminSidebar({
  ownerEmail,
  isConfigured,
}: {
  ownerEmail?: string;
  isConfigured: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FFE500] animate-pulse" />
          <span className="font-bold text-[#F2F2F2] tracking-wider">CMS CONTROL</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="px-2.5 py-1.5 border border-white/20 text-white/80 hover:text-[#FFE500]"
          aria-label="Toggle navigation drawer"
        >
          {mobileOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#050505] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand & System Status */}
          <div className="p-5 border-b border-white/10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFE500]" />
              <span className="font-mono font-bold text-sm tracking-wider text-[#F2F2F2]">
                SHANID // CMS
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConfigured ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>{isConfigured ? "SUPABASE: CONNECTED" : "SETUP MODE"}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 transition-colors border-l-2 ${
                    active
                      ? "bg-white/5 text-[#FFE500] border-[#FFE500] font-semibold"
                      : "text-white/60 hover:text-[#F2F2F2] hover:bg-white/[0.02] border-transparent"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="text-[10px]">›</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-3 font-mono text-xs">
          {ownerEmail && (
            <div className="text-[10px] text-white/40 truncate">
              <span>AUTH: </span>
              <span className="text-[#FFE500]">{ownerEmail}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 text-center border border-white/20 hover:border-[#FFE500] text-white/80 hover:text-[#FFE500] text-[11px] uppercase transition-colors"
            >
              Live Site ↗
            </Link>
            <form action={logoutAdminAction} className="flex-1">
              <button
                type="submit"
                className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-[11px] uppercase transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
