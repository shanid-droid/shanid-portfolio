import { getPublicWebsiteData } from "@/lib/cms";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { Navbar } from "@/components/Navbar";
import { CinematicHero } from "@/components/CinematicHero";
import { SectionsArchitecture } from "@/components/SectionsArchitecture";

export default async function Home() {
  const {
    settings,
    projects,
    skills,
    education,
    certificates,
    participations,
    experiments,
    interests,
    musicTracks,
  } = await getPublicWebsiteData();

  return (
    <main className="relative min-h-screen bg-[#030303] text-[#F2F2F2] selection:bg-[#FFE500] selection:text-[#030303]">
      {/* Interactive Cursor Spotlight (Desktop only, GPU optimized) */}
      <CursorSpotlight />

      {/* Cinematic HUD Header / Navbar */}
      <Navbar
        name={settings.nickname ? `M. ${settings.nickname.toUpperCase()}` : settings.name.toUpperCase()}
        location={settings.location}
        statusBadge={settings.status_badge}
      />

      {/* Cinematic Hero: Scroll-controlled hero video sequence with dynamic CMS text */}
      <CinematicHero
        videoUrl={settings.hero_video_url}
        tag={settings.hero_tag}
        name={settings.hero_title || settings.name}
        subtitle={settings.hero_subtitle}
      />

      {/* Structured dynamic CMS sections */}
      <SectionsArchitecture
        settings={settings}
        projects={projects}
        skills={skills}
        education={education}
        certificates={certificates}
        participations={participations}
        experiments={experiments}
        interests={interests}
        musicTracks={musicTracks}
      />
    </main>
  );
}
