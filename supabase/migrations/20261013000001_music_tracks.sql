-- =========================================================================
-- MUSIC TRACKS TABLE
-- Stores individual songs for Muhammed Shanid's playlist carousel.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.music_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    artwork_url TEXT,          -- Direct image URL (Spotify CDN, Supabase storage, etc.)
    youtube_url TEXT,          -- Track link (Spotify/YouTube)
    display_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Public can read published tracks
CREATE POLICY "Public can view published music tracks"
    ON public.music_tracks FOR SELECT
    USING (published = true);

-- Authenticated admin has full access
CREATE POLICY "Admin full access to music tracks"
    ON public.music_tracks FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed with Shanid's actual Spotify playlist tracks
INSERT INTO public.music_tracks (title, artist, artwork_url, youtube_url, display_order, published) VALUES
('Fairytale', 'Alexander Rybak', 'https://i.scdn.co/image/ab67616d0000b27349a39e0e4102b862ccee0fb0', 'https://open.spotify.com/track/3MnAsEBBsEj86d03RgO4EM', 1, true),
('Amsham - അംശം', 'Aksomaniac, M.H.R, Bhumi, Circle Tone', 'https://i.scdn.co/image/ab67616d0000b273530e627d6b4aced65e1ccf4a', 'https://open.spotify.com/track/0Dt5EqEckM8jcfMYEdlx2Z', 2, true),
('KALYANI (with Shreya Ghoshal) - Remix', 'ARJN, KDS, FIFTY4, Shreya Ghoshal', 'https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d', 'https://open.spotify.com/track/2y8mkajKikV5S1PRCMQ5WL', 3, true),
('KALYANI', 'ARJN, KDS, FIFTY4, RONN', 'https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d', 'https://open.spotify.com/track/5HeHLpZfNKSfInznFSiO3v', 4, true),
('KALYANI', 'ARJN, KDS, FIFTY4, RONN', 'https://i.scdn.co/image/ab67616d0000b2738c681e9dd49d13f7d223f8bf', 'https://open.spotify.com/track/2Uyj6K6mSaFTZsPvov415i', 5, true),
('Ishq de Fanniyar - Female Version', 'Jyotica Tangri, Shaarib Toshi, Kumaar', 'https://i.scdn.co/image/ab67616d0000b2738bcaf08c344aa0f7b169fa25', 'https://open.spotify.com/track/6JARNpkUypyzQEltxZM95O', 6, true),
('Bina Tere Na Ek Pal Ho', 'Neelima Prajith', 'https://i.scdn.co/image/ab67616d0000b27394441ba11dedf800f4bc6142', 'https://open.spotify.com/track/0d5TbOAXIoZbQBiK9Qv1M4', 7, true),
('Theher Ja', 'Garvit - Priyansh, Garvit Soni, Priyansh Srivastava, Aniket Shukla', 'https://i.scdn.co/image/ab67616d0000b273b9b56a91fa328950bc1b05ac', 'https://open.spotify.com/track/62G4WNFaG4HlsD5it4kgsw', 8, true),
('The Fate of Ophelia', 'Taylor Swift', 'https://i.scdn.co/image/ab67616d0000b273d7812467811a7da6e6a44902', 'https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W', 9, true),
('Moral of the Story', 'Ashe', 'https://i.scdn.co/image/ab67616d0000b273b11a359d135e3b8ef86d370c', 'https://open.spotify.com/track/0zSxpn1s0nk6VMpBMNqNFa', 10, true),
('I Wanna Be Yours', 'Arctic Monkeys', 'https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163', 'https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n', 11, true),
('Njanezhuthiya (Nee)', 'Levin Muthukad', 'https://i.scdn.co/image/ab67616d0000b27357b6bc1a0f3217ddb1e27a43', 'https://open.spotify.com/track/59Jshu3xecoxU0qZuboDeF', 12, true),
('Wildest Dreams', 'Taylor Swift', 'https://i.scdn.co/image/ab67616d0000b273b7e976d2b35c767f9012cb72', 'https://open.spotify.com/track/3fVnlF4pGqWI9flVENcT28', 13, true),
('Hridayathin Niramayi', 'Ashbel Peter, Samiya', 'https://i.scdn.co/image/ab67616d0000b273e29d723c6847c6338d2db3e7', 'https://open.spotify.com/track/5uxlrMoKZrfgZgMzmZIfls', 14, true),
('KAANAAN ULLILULLA BHAYAMMO', 'Anusree Suresh', 'https://i.scdn.co/image/ab67616d0000b273d3c9e2c3113826ea704f2582', 'https://open.spotify.com/track/1LB9qtABIVp4CuVveToUiA', 15, true),
('Nahin Milta', 'Bayaan', 'https://i.scdn.co/image/ab67616d0000b273ad5efa017cf3bc257a8147f7', 'https://open.spotify.com/track/5mUgHyCt7fZy7li4wt4Uq2', 16, true),
('Suzume', 'RADWIMPS, Toaka', 'https://i.scdn.co/image/ab67616d0000b273bc16d1eefe86b079c8805f8f', 'https://open.spotify.com/track/1n1y2kFPISpF9WGD3JaFo5', 17, true),
('Ennile Punchiri (Lofi Flip)', 'Sam C.S., Kapil Kapilan, K. S. Chithra, VIBIE', 'https://i.scdn.co/image/ab67616d0000b273586b878e1e5516498379f1bd', 'https://open.spotify.com/track/4RMmzwYIc3pypUUZ9VtTHx', 18, true),
('Falling Apart', 'OG Brar', 'https://i.scdn.co/image/ab67616d0000b27300891e511096c26cbee5bb34', 'https://open.spotify.com/track/32KpjQdvWIdXzykAvngVUv', 19, true),
('Jhol', 'Maanu, Annural Khalid', 'https://i.scdn.co/image/ab67616d0000b273da7d1408f8e776063963572f', 'https://open.spotify.com/track/4XTgFBxBHN6var1BzAgE1m', 20, true),
('Why Me', 'Manhar, Richie', 'https://i.scdn.co/image/ab67616d0000b273612042946c11d0f810d7cd46', 'https://open.spotify.com/track/6e4KOkUi3vWU3vp0px1YpT', 21, true),
('Sammi Meri Waarr', 'Muskan Chandalia, NZEEEE, Gagan, Perfecto', 'https://i.scdn.co/image/ab67616d0000b273f8c36f62cb11f14426e750ff', 'https://open.spotify.com/track/4KMMTcGfArahzaxD1MADyi', 22, true),
('Anbarey (From &quot;Gulu Gulu&quot;)', 'Santhosh Narayanan, Dhee', 'https://i.scdn.co/image/ab67616d0000b273b578bfa4b91f3d0300020730', 'https://open.spotify.com/track/78xl1agm6jjt1u7YvgWtLo', 23, true),
('Radhimaa - From &quot;Think Indie&quot;', 'Sai Abhyankkar, Nargis Teji, Asma Teji, Vivek, Sai Smriti', 'https://i.scdn.co/image/ab67616d0000b27324a93a0b07380c034f7d9d74', 'https://open.spotify.com/track/6jJHYbJReFfR2ieGzRP5bq', 24, true),
('Alaakaa Loova Unplugged (From &quot;OM Chapter 1: Udhiram - The Blood Wood&quot;) [Tamil]', 'Sai Abhyankkar, Rokesh', 'https://i.scdn.co/image/ab67616d0000b273ca2efa994564dc3df504b40c', 'https://open.spotify.com/track/4mAv9CWBlfLSkzOtdTxdX0', 25, true),
('ZILL', 'M.H.R, Shafi Kollam, JOKER390P', 'https://i.scdn.co/image/ab67616d0000b2732c3e5c303364018cf32045f7', 'https://open.spotify.com/track/12wlJpuAbgMv0OaYmY3r5x', 26, true),
('Asalayavale', 'Jakes Bejoy, Sid Sriram, Mohammed Maqbool Mansoor, Muthu', 'https://i.scdn.co/image/ab67616d0000b273382cd7dba59a869f917d9170', 'https://open.spotify.com/track/5hR2s2JMTPeeorKuezGexs', 27, true),
('Kinginichar', 'M.H.R, JOKER390P', 'https://i.scdn.co/image/ab67616d0000b2730cada67ed6914c22b9227f00', 'https://open.spotify.com/track/0ZdCs8N8qF5bBozuOGH56r', 28, true),
('Majboor', 'Sheheryar Rehan, Zoha Waseem', 'https://i.scdn.co/image/ab67616d0000b273ba7861fdb5826a0038078c23', 'https://open.spotify.com/track/0lp3WWhjxFVUht81AQmWX8', 29, true),
('End of Pookale', 'Vera Aristotle', 'https://i.scdn.co/image/ab67616d0000b273e890fa041873212b1f6ba57e', 'https://open.spotify.com/track/3oeMPVi6Dnnaww2omeqKRo', 30, true)
ON CONFLICT DO NOTHING;
