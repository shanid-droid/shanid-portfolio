import { createPublicSupabaseClient } from "./supabase/public";
import {
  type SiteSettings,
  type Project,
  type Skill,
  type Education,
  type Certificate,
  type Participation,
  type Experiment,
  type Interest,
  type MusicTrack,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_MUSIC_TRACKS,
} from "./types";

export * from "./types";

/**
 * Fetch public data for the public website.
 * Falls back safely to default seed data if Supabase is unconfigured or unavailable.
 */
export async function getPublicWebsiteData() {
  "use cache";
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      education: [] as Education[],
      certificates: [] as Certificate[],
      participations: [] as Participation[],
      experiments: [] as Experiment[],
      interests: [] as Interest[],
      musicTracks: DEFAULT_MUSIC_TRACKS,
      isConfigured: false,
    };
  }

  try {
    const supabase = createPublicSupabaseClient();

    const [
      settingsRes,
      projectsRes,
      skillsRes,
      educationRes,
      certificatesRes,
      participationsRes,
      experimentsRes,
      interestsRes,
      musicTracksRes,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("skills").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("education").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("certificates").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("participations").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("experiments").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("interests").select("*").eq("published", true).order("display_order", { ascending: true }),
      supabase.from("music_tracks").select("*").eq("published", true).order("display_order", { ascending: true }),
    ]);

    return {
      settings: settingsRes.data ? (settingsRes.data as SiteSettings) : DEFAULT_SITE_SETTINGS,
      projects: (projectsRes.data && projectsRes.data.length > 0 ? projectsRes.data : DEFAULT_PROJECTS) as Project[],
      skills: (skillsRes.data && skillsRes.data.length > 0 ? skillsRes.data : DEFAULT_SKILLS) as Skill[],
      education: (educationRes.data || []) as Education[],
      certificates: (certificatesRes.data || []) as Certificate[],
      participations: (participationsRes.data || []) as Participation[],
      experiments: (experimentsRes.data || []) as Experiment[],
      interests: (interestsRes.data || []) as Interest[],
      // If the table doesn't exist yet (error != null), fall back to the hardcoded defaults
      musicTracks: (musicTracksRes.data && musicTracksRes.data.length > 0
        ? musicTracksRes.data
        : DEFAULT_MUSIC_TRACKS) as MusicTrack[],
      isConfigured: true,
    };
  } catch (error) {
    console.error("Error fetching public website data from Supabase:", error);
    return {
      settings: DEFAULT_SITE_SETTINGS,
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      education: [] as Education[],
      certificates: [] as Certificate[],
      participations: [] as Participation[],
      experiments: [] as Experiment[],
      interests: [] as Interest[],
      musicTracks: DEFAULT_MUSIC_TRACKS,
      isConfigured: false,
    };
  }
}
