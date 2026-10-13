import Link from "next/link";
import { getPublicWebsiteData } from "@/lib/cms";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const cmsData = await getPublicWebsiteData();
  let unreadMessagesCount = 0;

  if (isConfigured) {
    try {
      const supabase = await createServerSupabaseClient();
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      unreadMessagesCount = count || 0;
    } catch {
      // In case messages table isn't migrated yet
    }
  }

  const sections = [
    {
      title: "Projects & Demos",
      count: cmsData.projects.length,
      href: "/admin/projects",
      desc: "Manage showcased works, screenshots, tags, links, and display order.",
    },
    {
      title: "Skills & Toolstack",
      count: cmsData.skills.length,
      href: "/admin/skills",
      desc: "Configure technical capabilities, categorization, and proficiency levels.",
    },
    {
      title: "Site & Hero",
      count: 1,
      href: "/admin/settings",
      desc: "Profile, tagline, hero video, location, SEO, and section visibility.",
    },
    {
      title: "Education & Certs",
      count: cmsData.education.length + cmsData.certificates.length,
      href: "/admin/education",
      desc: "Academic credentials, degrees, institutions, and verified certificates.",
    },
    {
      title: "Participations",
      count: cmsData.participations.length,
      href: "/admin/participations",
      desc: "Programs, hackathons, residencies, and exhibition history.",
    },
    {
      title: "Experiments & Ideas",
      count: cmsData.experiments.length,
      href: "/admin/experiments",
      desc: "AI research prototypes, ongoing builds, design studies, and concepts.",
    },
    {
      title: "Interests & Memories",
      count: cmsData.interests.length,
      href: "/admin/interests",
      desc: "Creative hobbies, Spotify playlist links, and photo memories.",
    },
    {
      title: "Contact Messages",
      count: unreadMessagesCount,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} NEW` : undefined,
      href: "/admin/messages",
      desc: "Private inbound contact inquiries submitted via public portfolio.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            CONTROL CENTER // OVERVIEW
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#F2F2F2]">
            ADMIN DASHBOARD
          </h1>
        </div>
        <div className="text-xs text-white/50">
          STATUS: <span className="text-emerald-400 font-bold">OPERATIONAL</span>
        </div>
      </div>

      {/* Hero Quick Status Card */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#FFE500]">
            <span className="w-2 h-2 bg-[#FFE500]" />
            <span>HERO CONFIGURATION: {cmsData.settings.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#F2F2F2]">
            “{cmsData.settings.hero_subtitle}”
          </h2>
          <p className="text-xs text-white/60 font-mono">
            VIDEO ASSET: {cmsData.settings.hero_video_url} | LOC: {cmsData.settings.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 font-mono text-xs">
          <Link
            href="/admin/settings"
            className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold uppercase hover:bg-white transition-all"
          >
            Edit Hero & Settings
          </Link>
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 border border-white/20 hover:border-[#FFE500] text-white/80 hover:text-[#FFE500] uppercase transition-all"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <Link
            key={sec.title}
            href={sec.href}
            className="group bg-[#0a0a0a] border border-white/10 p-6 hover:border-[#FFE500] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-white/40 mb-3">
                <span>{sec.count} ITEMS</span>
                {sec.badge && (
                  <span className="px-2 py-0.5 bg-[#FFE500] text-[#030303] font-bold text-[10px]">
                    {sec.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold uppercase text-[#F2F2F2] group-hover:text-[#FFE500] transition-colors mb-2">
                {sec.title}
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                {sec.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 font-mono text-xs text-[#FFE500] flex items-center justify-between">
              <span>Open Manager</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
