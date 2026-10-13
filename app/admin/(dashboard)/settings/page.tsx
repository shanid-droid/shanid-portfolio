"use client";

import { useState, useTransition, useEffect } from "react";
import { updateSiteSettingsAction } from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current settings from Supabase if available
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings(data as SiteSettings);
        }
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);

    startTransition(async () => {
      try {
        await updateSiteSettingsAction(settings);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to update settings");
      }
    });
  };

  const handleVisibilityChange = (key: keyof SiteSettings["sections_visibility"]) => {
    setSettings((prev) => ({
      ...prev,
      sections_visibility: {
        ...prev.sections_visibility,
        [key]: !prev.sections_visibility[key],
      },
    }));
  };

  return (
    <div className="space-y-8 font-mono max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            SITE CONFIGURATION // CORE
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            SITE & HERO SETTINGS
          </h1>
        </div>
        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            CHANGES SAVED TO CMS
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Section 1: Hero & Identity */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
            // 01. HERO SEQUENCE & CORE IDENTITY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">FULL NAME</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">NICKNAME / SIGNATURE</label>
              <input
                type="text"
                value={settings.nickname || ""}
                onChange={(e) => setSettings({ ...settings, nickname: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">HERO BADGE TAG</label>
              <input
                type="text"
                value={settings.hero_tag}
                onChange={(e) => setSettings({ ...settings, hero_tag: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">HERO SUBTITLE (TAGLINE)</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>

          <MediaUploader
            label="HERO VIDEO ASSET (MP4 / WEBM)"
            value={settings.hero_video_url}
            onChange={(url) => setSettings({ ...settings, hero_video_url: url || "/videos/hero-intro.mp4" })}
            accept="video/*"
          />

          <MediaUploader
            label="PROFILE PHOTO / PORTRAIT (OPTIONAL)"
            value={settings.photo_url || ""}
            onChange={(url) => setSettings({ ...settings, photo_url: url })}
            accept="image/*"
          />

          <div>
            <label className="block text-white/60 mb-1">CORE BIOGRAPHY</label>
            <textarea
              rows={3}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
            />
          </div>
        </div>

        {/* Section 2: Contact, Location & Socials */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
            // 02. LOCATION, TELEMETRY & SOCIAL CHANNELS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">LOCATION COORDINATES</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">HARDWARE BADGE STATUS</label>
              <input
                type="text"
                value={settings.status_badge}
                onChange={(e) => setSettings({ ...settings, status_badge: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">CONTACT EMAIL</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">SPOTIFY PLAYLIST URL</label>
              <input
                type="url"
                value={settings.spotify_playlist_url || ""}
                onChange={(e) => setSettings({ ...settings, spotify_playlist_url: e.target.value })}
                placeholder="https://open.spotify.com/playlist/..."
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/60 mb-1">GITHUB URL</label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">LINKEDIN URL</label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="block text-white/60 mb-1">TWITTER / X URL</label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sections Visibility Controls */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
            // 03. PUBLIC SECTION VISIBILITY
          </h2>
          <p className="text-white/50 text-[11px]">
            Toggle which content modules are rendered on the public website. Hidden sections will not render.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(settings.sections_visibility).map(([key, isVisible]) => (
              <label
                key={key}
                className="flex items-center gap-2.5 p-2.5 bg-black border border-white/10 hover:border-white/30 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => handleVisibilityChange(key as keyof SiteSettings["sections_visibility"])}
                  className="accent-[#FFE500] w-4 h-4 cursor-pointer"
                />
                <span className="uppercase text-white/80">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: SEO & Footer */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
            // 04. SEO & FOOTER
          </h2>

          <div>
            <label className="block text-white/60 mb-1">SEO META TITLE</label>
            <input
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1">SEO META DESCRIPTION</label>
            <textarea
              rows={2}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1">FOOTER TEXT</label>
            <input
              type="text"
              value={settings.footer_text}
              onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-4 p-4 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#FFE500]/40 flex items-center justify-between shadow-2xl">
          <div className="text-white/60 text-[11px]">
            {isPending ? "TRANSMITTING CHANGES..." : "PENDING UPDATES WILL APPLY TO PUBLIC SITE"}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-[#FFE500] text-[#030303] font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50"
          >
            {isPending ? "SAVING..." : "SAVE SITE SETTINGS"}
          </button>
        </div>
      </form>
    </div>
  );
}
