export interface SiteSettings {
  id?: number;
  name: string;
  nickname: string;
  photo_url?: string;
  bio: string;
  hero_video_url: string;
  hero_tag: string;
  hero_title: string;
  hero_subtitle: string;
  location: string;
  status_badge: string;
  contact_email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  spotify_playlist_url?: string;
  seo_title: string;
  seo_description: string;
  sections_visibility: {
    projects: boolean;
    about: boolean;
    skills: boolean;
    education: boolean;
    certificates: boolean;
    participation: boolean;
    experiments: boolean;
    interests: boolean;
    spotify: boolean;
    contact: boolean;
  };
  footer_text: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  long_description?: string;
  demo_url?: string;
  repo_url?: string;
  screenshot_url?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level?: string;
  display_order: number;
  published: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  display_order: number;
  published: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_url?: string;
  display_order: number;
  published: boolean;
}

export interface Participation {
  id: string;
  title: string;
  role_or_type?: string;
  organization_or_event: string;
  date?: string;
  description?: string;
  link_url?: string;
  display_order: number;
  published: boolean;
}

export interface Experiment {
  id: string;
  title: string;
  type: "ai_experiment" | "ongoing_work" | "idea" | "design";
  status: string;
  description: string;
  link_url?: string;
  media_url?: string;
  display_order: number;
  published: boolean;
}

export interface Interest {
  id: string;
  title: string;
  category: "hobby" | "interest" | "memory";
  description?: string;
  media_url?: string;
  display_order: number;
  published: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  artwork_url?: string;
  youtube_url?: string;
  display_order: number;
  published: boolean;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// DEFAULT VERIFIED SEED DATA
// ---------------------------------------------------------------------------

/** Fallback playlist used when Supabase is unconfigured or music_tracks table is missing. */
export const DEFAULT_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "1",
    title: "Fairytale",
    artist: "Alexander Rybak",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b27349a39e0e4102b862ccee0fb0",
    youtube_url: "https://open.spotify.com/track/3MnAsEBBsEj86d03RgO4EM",
    display_order: 1,
    published: true,
  },
  {
    id: "2",
    title: "Amsham - അംശം",
    artist: "Aksomaniac, M.H.R, Bhumi, Circle Tone",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273530e627d6b4aced65e1ccf4a",
    youtube_url: "https://open.spotify.com/track/0Dt5EqEckM8jcfMYEdlx2Z",
    display_order: 2,
    published: true,
  },
  {
    id: "3",
    title: "KALYANI (with Shreya Ghoshal) - Remix",
    artist: "ARJN, KDS, FIFTY4, Shreya Ghoshal",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d",
    youtube_url: "https://open.spotify.com/track/2y8mkajKikV5S1PRCMQ5WL",
    display_order: 3,
    published: true,
  },
  {
    id: "4",
    title: "KALYANI",
    artist: "ARJN, KDS, FIFTY4, RONN",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d",
    youtube_url: "https://open.spotify.com/track/5HeHLpZfNKSfInznFSiO3v",
    display_order: 4,
    published: true,
  },
  {
    id: "5",
    title: "KALYANI",
    artist: "ARJN, KDS, FIFTY4, RONN",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2738c681e9dd49d13f7d223f8bf",
    youtube_url: "https://open.spotify.com/track/2Uyj6K6mSaFTZsPvov415i",
    display_order: 5,
    published: true,
  },
  {
    id: "6",
    title: "Ishq de Fanniyar - Female Version",
    artist: "Jyotica Tangri, Shaarib Toshi, Kumaar",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2738bcaf08c344aa0f7b169fa25",
    youtube_url: "https://open.spotify.com/track/6JARNpkUypyzQEltxZM95O",
    display_order: 6,
    published: true,
  },
  {
    id: "7",
    title: "Bina Tere Na Ek Pal Ho",
    artist: "Neelima Prajith",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b27394441ba11dedf800f4bc6142",
    youtube_url: "https://open.spotify.com/track/0d5TbOAXIoZbQBiK9Qv1M4",
    display_order: 7,
    published: true,
  },
  {
    id: "8",
    title: "Theher Ja",
    artist: "Garvit - Priyansh, Garvit Soni, Priyansh Srivastava, Aniket Shukla",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273b9b56a91fa328950bc1b05ac",
    youtube_url: "https://open.spotify.com/track/62G4WNFaG4HlsD5it4kgsw",
    display_order: 8,
    published: true,
  },
  {
    id: "9",
    title: "The Fate of Ophelia",
    artist: "Taylor Swift",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273d7812467811a7da6e6a44902",
    youtube_url: "https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W",
    display_order: 9,
    published: true,
  },
  {
    id: "10",
    title: "Moral of the Story",
    artist: "Ashe",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273b11a359d135e3b8ef86d370c",
    youtube_url: "https://open.spotify.com/track/0zSxpn1s0nk6VMpBMNqNFa",
    display_order: 10,
    published: true,
  },
  {
    id: "11",
    title: "I Wanna Be Yours",
    artist: "Arctic Monkeys",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163",
    youtube_url: "https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n",
    display_order: 11,
    published: true,
  },
  {
    id: "12",
    title: "Njanezhuthiya (Nee)",
    artist: "Levin Muthukad",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b27357b6bc1a0f3217ddb1e27a43",
    youtube_url: "https://open.spotify.com/track/59Jshu3xecoxU0qZuboDeF",
    display_order: 12,
    published: true,
  },
  {
    id: "13",
    title: "Wildest Dreams",
    artist: "Taylor Swift",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273b7e976d2b35c767f9012cb72",
    youtube_url: "https://open.spotify.com/track/3fVnlF4pGqWI9flVENcT28",
    display_order: 13,
    published: true,
  },
  {
    id: "14",
    title: "Hridayathin Niramayi",
    artist: "Ashbel Peter, Samiya",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273e29d723c6847c6338d2db3e7",
    youtube_url: "https://open.spotify.com/track/5uxlrMoKZrfgZgMzmZIfls",
    display_order: 14,
    published: true,
  },
  {
    id: "15",
    title: "KAANAAN ULLILULLA BHAYAMMO",
    artist: "Anusree Suresh",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273d3c9e2c3113826ea704f2582",
    youtube_url: "https://open.spotify.com/track/1LB9qtABIVp4CuVveToUiA",
    display_order: 15,
    published: true,
  },
  {
    id: "16",
    title: "Nahin Milta",
    artist: "Bayaan",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273ad5efa017cf3bc257a8147f7",
    youtube_url: "https://open.spotify.com/track/5mUgHyCt7fZy7li4wt4Uq2",
    display_order: 16,
    published: true,
  },
  {
    id: "17",
    title: "Suzume",
    artist: "RADWIMPS, Toaka",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273bc16d1eefe86b079c8805f8f",
    youtube_url: "https://open.spotify.com/track/1n1y2kFPISpF9WGD3JaFo5",
    display_order: 17,
    published: true,
  },
  {
    id: "18",
    title: "Ennile Punchiri (Lofi Flip)",
    artist: "Sam C.S., Kapil Kapilan, K. S. Chithra, VIBIE",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273586b878e1e5516498379f1bd",
    youtube_url: "https://open.spotify.com/track/4RMmzwYIc3pypUUZ9VtTHx",
    display_order: 18,
    published: true,
  },
  {
    id: "19",
    title: "Falling Apart",
    artist: "OG Brar",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b27300891e511096c26cbee5bb34",
    youtube_url: "https://open.spotify.com/track/32KpjQdvWIdXzykAvngVUv",
    display_order: 19,
    published: true,
  },
  {
    id: "20",
    title: "Jhol",
    artist: "Maanu, Annural Khalid",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273da7d1408f8e776063963572f",
    youtube_url: "https://open.spotify.com/track/4XTgFBxBHN6var1BzAgE1m",
    display_order: 20,
    published: true,
  },
  {
    id: "21",
    title: "Why Me",
    artist: "Manhar, Richie",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273612042946c11d0f810d7cd46",
    youtube_url: "https://open.spotify.com/track/6e4KOkUi3vWU3vp0px1YpT",
    display_order: 21,
    published: true,
  },
  {
    id: "22",
    title: "Sammi Meri Waarr",
    artist: "Muskan Chandalia, NZEEEE, Gagan, Perfecto",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273f8c36f62cb11f14426e750ff",
    youtube_url: "https://open.spotify.com/track/4KMMTcGfArahzaxD1MADyi",
    display_order: 22,
    published: true,
  },
  {
    id: "23",
    title: "Anbarey (From &quot;Gulu Gulu&quot;)",
    artist: "Santhosh Narayanan, Dhee",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273b578bfa4b91f3d0300020730",
    youtube_url: "https://open.spotify.com/track/78xl1agm6jjt1u7YvgWtLo",
    display_order: 23,
    published: true,
  },
  {
    id: "24",
    title: "Radhimaa - From &quot;Think Indie&quot;",
    artist: "Sai Abhyankkar, Nargis Teji, Asma Teji, Vivek, Sai Smriti",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b27324a93a0b07380c034f7d9d74",
    youtube_url: "https://open.spotify.com/track/6jJHYbJReFfR2ieGzRP5bq",
    display_order: 24,
    published: true,
  },
  {
    id: "25",
    title: "Alaakaa Loova Unplugged (From &quot;OM Chapter 1: Udhiram - The Blood Wood&quot;) [Tamil]",
    artist: "Sai Abhyankkar, Rokesh",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273ca2efa994564dc3df504b40c",
    youtube_url: "https://open.spotify.com/track/4mAv9CWBlfLSkzOtdTxdX0",
    display_order: 25,
    published: true,
  },
  {
    id: "26",
    title: "ZILL",
    artist: "M.H.R, Shafi Kollam, JOKER390P",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2732c3e5c303364018cf32045f7",
    youtube_url: "https://open.spotify.com/track/12wlJpuAbgMv0OaYmY3r5x",
    display_order: 26,
    published: true,
  },
  {
    id: "27",
    title: "Asalayavale",
    artist: "Jakes Bejoy, Sid Sriram, Mohammed Maqbool Mansoor, Muthu",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273382cd7dba59a869f917d9170",
    youtube_url: "https://open.spotify.com/track/5hR2s2JMTPeeorKuezGexs",
    display_order: 27,
    published: true,
  },
  {
    id: "28",
    title: "Kinginichar",
    artist: "M.H.R, JOKER390P",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b2730cada67ed6914c22b9227f00",
    youtube_url: "https://open.spotify.com/track/0ZdCs8N8qF5bBozuOGH56r",
    display_order: 28,
    published: true,
  },
  {
    id: "29",
    title: "Majboor",
    artist: "Sheheryar Rehan, Zoha Waseem",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273ba7861fdb5826a0038078c23",
    youtube_url: "https://open.spotify.com/track/0lp3WWhjxFVUht81AQmWX8",
    display_order: 29,
    published: true,
  },
  {
    id: "30",
    title: "End of Pookale",
    artist: "Vera Aristotle",
    artwork_url: "https://i.scdn.co/image/ab67616d0000b273e890fa041873212b1f6ba57e",
    youtube_url: "https://open.spotify.com/track/3oeMPVi6Dnnaww2omeqKRo",
    display_order: 30,
    published: true,
  },
];
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  name: "Muhammed Shanid",
  nickname: "Shanid",
  bio: "A creative technologist focused on the intersection between low-level computational constraints and rich sensory interfaces.",
  hero_video_url: "/videos/hero-intro.mp4",
  hero_tag: "Systems & XR Technologist",
  hero_title: "Muhammed Shanid",
  hero_subtitle: "Curiosity, made tangible.",
  location: "11.25°N, 75.78°E [IN]",
  status_badge: "UHD: ACCELERATED",
  contact_email: "contact@shanid.dev",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://x.com",
  spotify_playlist_url: "",
  seo_title: "Muhammed Shanid // Creative Technologist & Systems Developer",
  seo_description: "Experimental, cinematic portfolio of Muhammed Shanid. Spatial systems, XR prototypes, and physical computing.",
  sections_visibility: {
    projects: true,
    about: true,
    skills: true,
    education: true,
    certificates: true,
    participation: true,
    experiments: true,
    interests: true,
    spotify: true,
    contact: true,
  },
  footer_text: "© 2026 MUHAMMED SHANID // ALL RIGHTS RESERVED",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    slug: "isomer-lab",
    title: "ISOMER LAB",
    category: "RESEARCH & SPATIAL SYSTEMS",
    status: "ACTIVE EXPERIMENTAL LAB",
    description: "A creative technology and engineering laboratory exploring procedural simulations, spatial interfaces, and hardware-software synergy.",
    tags: ["Spatial Computing", "Graphics", "Interactive Systems", "Prototypes"],
    featured: true,
    published: true,
    display_order: 1,
  },
  {
    id: "2",
    slug: "blind-vr",
    title: "Blind-VR",
    category: "XR ACCESSIBILITY PROTOTYPE",
    status: "CONCEPT PROTOTYPE",
    description: "An exploratory virtual reality framework investigating non-visual sensory substitution, spatialized binaural audio, and haptic navigational feedback.",
    tags: ["VR", "Spatial Audio", "Accessibility", "Sensory Substitution"],
    featured: true,
    published: true,
    display_order: 2,
  },
  {
    id: "3",
    slug: "isomer-lights",
    title: "ISOMER LIGHTS",
    category: "PHYSICAL COMPUTING & LIGHTING",
    status: "HARDWARE PROTOTYPE",
    description: "Custom responsive lighting and ambient telemetry installation reacting to real-time software audio frequencies and room presence.",
    tags: ["Microcontrollers", "LED Telemetry", "Serial Protocols", "Physical Computing"],
    featured: true,
    published: true,
    display_order: 3,
  },
  {
    id: "4",
    slug: "mini-desktop-pet",
    title: "Mini Desktop Pet",
    category: "INTERACTIVE DESKTOP COMPANION",
    status: "SOFTWARE UTILITY",
    description: "A lightweight, reactive desktop system companion that monitors background workload and provides micro-interactions without hogging system resources.",
    tags: ["Desktop UI", "Lightweight Process", "System Monitoring", "Micro-Interactions"],
    featured: true,
    published: true,
    display_order: 4,
  },
];

export const DEFAULT_SKILLS: Skill[] = [
  { id: "1", category: "CORE WEB & GRAPHICS", name: "Next.js / React 19", level: "Advanced", display_order: 1, published: true },
  { id: "2", category: "CORE WEB & GRAPHICS", name: "TypeScript / Modern JS", level: "Advanced", display_order: 2, published: true },
  { id: "3", category: "CORE WEB & GRAPHICS", name: "Tailwind CSS & Custom Design Systems", level: "Advanced", display_order: 3, published: true },
  { id: "4", category: "CORE WEB & GRAPHICS", name: "GSAP & Motion Animation", level: "Proficient", display_order: 4, published: true },
  { id: "5", category: "CORE WEB & GRAPHICS", name: "Canvas API / WebGL Fundamentals", level: "Intermediate", display_order: 5, published: true },
  { id: "6", category: "SPATIAL & PHYSICAL COMPUTING", name: "XR Prototyping & Spatial Concepts", level: "Proficient", display_order: 6, published: true },
  { id: "7", category: "SPATIAL & PHYSICAL COMPUTING", name: "Microcontroller Interfacing (ESP/Arduino)", level: "Proficient", display_order: 7, published: true },
  { id: "8", category: "SPATIAL & PHYSICAL COMPUTING", name: "Serial & WebSocket Protocols", level: "Proficient", display_order: 8, published: true },
  { id: "9", category: "SPATIAL & PHYSICAL COMPUTING", name: "Spatial Audio Architecture", level: "Intermediate", display_order: 9, published: true },
  { id: "10", category: "SPATIAL & PHYSICAL COMPUTING", name: "Real-Time Lighting Rig Control", level: "Proficient", display_order: 10, published: true },
  { id: "11", category: "SYSTEMS & PERFORMANCE", name: "Low-overhead Render Pipelines", level: "Proficient", display_order: 11, published: true },
  { id: "12", category: "SYSTEMS & PERFORMANCE", name: "Integrated GPU / UHD Optimization", level: "Proficient", display_order: 12, published: true },
  { id: "13", category: "SYSTEMS & PERFORMANCE", name: "Mobile-First Responsive Architectures", level: "Advanced", display_order: 13, published: true },
  { id: "14", category: "SYSTEMS & PERFORMANCE", name: "Git Version Control & CI/CD", level: "Advanced", display_order: 14, published: true },
  { id: "15", category: "SYSTEMS & PERFORMANCE", name: "Component Profiling & Memory Mgmt", level: "Proficient", display_order: 15, published: true },
];
