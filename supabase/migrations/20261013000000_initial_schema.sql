-- =========================================================================
-- MUHAMMED SHANID PORTFOLIO - SUPABASE CMS SCHEMA & SEED DATA
-- Version: 2026.10.13
-- =========================================================================

-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. SITE SETTINGS TABLE (Singleton)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL DEFAULT 'Muhammed Shanid',
    nickname TEXT DEFAULT 'Shanid',
    photo_url TEXT,
    bio TEXT DEFAULT 'A creative technologist focused on the intersection between low-level computational constraints and rich sensory interfaces.',
    hero_video_url TEXT NOT NULL DEFAULT '/videos/hero-intro.mp4',
    hero_tag TEXT DEFAULT 'Systems & XR Technologist',
    hero_title TEXT DEFAULT 'Muhammed Shanid',
    hero_subtitle TEXT DEFAULT 'Curiosity, made tangible.',
    location TEXT DEFAULT '11.25°N, 75.78°E [IN]',
    status_badge TEXT DEFAULT 'UHD: ACCELERATED',
    contact_email TEXT DEFAULT 'contact@shanid.dev',
    github_url TEXT DEFAULT 'https://github.com',
    linkedin_url TEXT DEFAULT 'https://linkedin.com',
    twitter_url TEXT DEFAULT 'https://x.com',
    spotify_playlist_url TEXT DEFAULT '',
    seo_title TEXT DEFAULT 'Muhammed Shanid // Creative Technologist & Systems Developer',
    seo_description TEXT DEFAULT 'Experimental, cinematic portfolio of Muhammed Shanid. Spatial systems, XR prototypes, and physical computing.',
    sections_visibility JSONB DEFAULT '{
        "projects": true,
        "about": true,
        "skills": true,
        "education": true,
        "certificates": true,
        "participation": true,
        "experiments": true,
        "interests": true,
        "spotify": true,
        "contact": true
    }'::jsonb,
    footer_text TEXT DEFAULT '© 2026 MUHAMMED SHANID // ALL RIGHTS RESERVED',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- -------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE PROTOTYPE',
    description TEXT NOT NULL,
    long_description TEXT,
    demo_url TEXT,
    repo_url TEXT,
    screenshot_url TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    featured BOOLEAN DEFAULT false NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 3. SKILLS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    level TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 4. EDUCATION TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 5. CERTIFICATES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    credential_url TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 6. PARTICIPATIONS TABLE (Programs, Events, Hackathons, Residencies)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    role_or_type TEXT,
    organization_or_event TEXT NOT NULL,
    date TEXT,
    description TEXT,
    link_url TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 7. EXPERIMENTS TABLE (AI Experiments, Ongoing Work, Ideas, Designs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ai_experiment', 'ongoing_work', 'idea', 'design')),
    status TEXT DEFAULT 'IN PROGRESS',
    description TEXT NOT NULL,
    link_url TEXT,
    media_url TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 8. INTERESTS TABLE (Hobbies, Interests, Spotify, Memories/Photos)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hobby', 'interest', 'memory')),
    description TEXT,
    media_url TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 9. MESSAGES TABLE (Contact form inquiries - Private)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Only published content)
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published skills"
    ON public.skills FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published education"
    ON public.education FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published certificates"
    ON public.certificates FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published participations"
    ON public.participations FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published experiments"
    ON public.experiments FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view published interests"
    ON public.interests FOR SELECT
    USING (published = true);

-- MESSAGES: Public can insert inquiries, but can NEVER read them
CREATE POLICY "Public can submit contact messages"
    ON public.messages FOR INSERT
    WITH CHECK (true);

-- AUTHENTICATED ADMIN FULL ACCESS (Mutations & Draft viewing)
-- Authenticated users (the owner) can perform all operations
CREATE POLICY "Admin full access to site_settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to education"
    ON public.education FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to certificates"
    ON public.certificates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to participations"
    ON public.participations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to experiments"
    ON public.experiments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to interests"
    ON public.interests FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to messages"
    ON public.messages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 11. STORAGE BUCKET CREATION (portfolio-media)
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read storage files
CREATE POLICY "Public can read portfolio media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- Authenticated owner can upload, update, delete storage files
CREATE POLICY "Admin can upload portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Admin can update portfolio media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin can delete portfolio media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

-- -------------------------------------------------------------------------
-- 12. SEED INITIAL DATA
-- -------------------------------------------------------------------------
INSERT INTO public.site_settings (
    id, name, nickname, bio, hero_video_url, hero_tag, hero_title, hero_subtitle, location, status_badge
) VALUES (
    1,
    'Muhammed Shanid',
    'Shanid',
    'A creative technologist focused on the intersection between low-level computational constraints and rich sensory interfaces.',
    '/videos/hero-intro.mp4',
    'Systems & XR Technologist',
    'Muhammed Shanid',
    'Curiosity, made tangible.',
    '11.25°N, 75.78°E [IN]',
    'UHD: ACCELERATED'
) ON CONFLICT (id) DO NOTHING;

-- Seed Confirmed Projects
INSERT INTO public.projects (
    slug, title, category, status, description, tags, featured, published, display_order
) VALUES
(
    'isomer-lab',
    'ISOMER LAB',
    'RESEARCH & SPATIAL SYSTEMS',
    'ACTIVE EXPERIMENTAL LAB',
    'A creative technology and engineering laboratory exploring procedural simulations, spatial interfaces, and hardware-software synergy.',
    ARRAY['Spatial Computing', 'Graphics', 'Interactive Systems', 'Prototypes'],
    true,
    true,
    1
),
(
    'blind-vr',
    'Blind-VR',
    'XR ACCESSIBILITY PROTOTYPE',
    'CONCEPT PROTOTYPE',
    'An exploratory virtual reality framework investigating non-visual sensory substitution, spatialized binaural audio, and haptic navigational feedback.',
    ARRAY['VR', 'Spatial Audio', 'Accessibility', 'Sensory Substitution'],
    true,
    true,
    2
),
(
    'isomer-lights',
    'ISOMER LIGHTS',
    'PHYSICAL COMPUTING & LIGHTING',
    'HARDWARE PROTOTYPE',
    'Custom responsive lighting and ambient telemetry installation reacting to real-time software audio frequencies and room presence.',
    ARRAY['Microcontrollers', 'LED Telemetry', 'Serial Protocols', 'Physical Computing'],
    true,
    true,
    3
),
(
    'mini-desktop-pet',
    'Mini Desktop Pet',
    'INTERACTIVE DESKTOP COMPANION',
    'SOFTWARE UTILITY',
    'A lightweight, reactive desktop system companion that monitors background workload and provides micro-interactions without hogging system resources.',
    ARRAY['Desktop UI', 'Lightweight Process', 'System Monitoring', 'Micro-Interactions'],
    true,
    true,
    4
) ON CONFLICT (slug) DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (category, name, level, display_order, published) VALUES
('CORE WEB & GRAPHICS', 'Next.js / React 19', 'Advanced', 1, true),
('CORE WEB & GRAPHICS', 'TypeScript / Modern JS', 'Advanced', 2, true),
('CORE WEB & GRAPHICS', 'Tailwind CSS & Custom Design Systems', 'Advanced', 3, true),
('CORE WEB & GRAPHICS', 'GSAP & Motion Animation', 'Proficient', 4, true),
('CORE WEB & GRAPHICS', 'Canvas API / WebGL Fundamentals', 'Intermediate', 5, true),
('SPATIAL & PHYSICAL COMPUTING', 'XR Prototyping & Spatial Concepts', 'Proficient', 6, true),
('SPATIAL & PHYSICAL COMPUTING', 'Microcontroller Interfacing (ESP/Arduino)', 'Proficient', 7, true),
('SPATIAL & PHYSICAL COMPUTING', 'Serial & WebSocket Protocols', 'Proficient', 8, true),
('SPATIAL & PHYSICAL COMPUTING', 'Spatial Audio Architecture', 'Intermediate', 9, true),
('SPATIAL & PHYSICAL COMPUTING', 'Real-Time Lighting Rig Control', 'Proficient', 10, true),
('SYSTEMS & PERFORMANCE', 'Low-overhead Render Pipelines', 'Proficient', 11, true),
('SYSTEMS & PERFORMANCE', 'Integrated GPU / UHD Optimization', 'Proficient', 12, true),
('SYSTEMS & PERFORMANCE', 'Mobile-First Responsive Architectures', 'Advanced', 13, true),
('SYSTEMS & PERFORMANCE', 'Git Version Control & CI/CD', 'Advanced', 14, true),
('SYSTEMS & PERFORMANCE', 'Component Profiling & Memory Mgmt', 'Proficient', 15, true);
