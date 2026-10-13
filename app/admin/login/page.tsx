"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { loginAdminAction } from "@/lib/actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await loginAdminAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#F2F2F2] flex items-center justify-center p-4 font-mono">
      {/* Background Ambience */}
      <div className="fixed inset-0 tech-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
        {/* Header HUD */}
        <div className="border-b border-white/10 pb-4 mb-6 space-y-1">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFE500] animate-pulse" />
              RESTRICTED ACCESS
            </span>
            <span>SEC_LEVEL: 01</span>
          </div>
          <h1 className="text-2xl font-black uppercase text-[#F2F2F2] tracking-wider pt-2">
            ADMIN // AUTH
          </h1>
          <p className="text-xs text-white/50 font-light">
            Authenticate using the authorized portfolio owner credentials.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
            <span className="font-bold mr-1">ERROR:</span> {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/60 uppercase tracking-wider mb-1.5">
              Owner Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="owner@domain.com"
              className="w-full px-3 py-2.5 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/60 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#FFE500] text-[#030303] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 mt-2 shadow-[0_0_16px_rgba(255,229,0,0.2)]"
          >
            {isPending ? "AUTHENTICATING..." : "VERIFY & ENTER DASHBOARD"}
          </button>
        </form>

        {/* Footer & Return Link */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
          <Link href="/" className="hover:text-[#FFE500] transition-colors">
            ← Return to Public Portfolio
          </Link>
          <span>M. SHANID // CMS</span>
        </div>
      </div>
    </div>
  );
}
