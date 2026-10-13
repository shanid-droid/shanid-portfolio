"use client";

import { useState, useTransition, useEffect } from "react";
import { upsertMusicTrackAction, deleteMusicTrackAction } from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { type MusicTrack, DEFAULT_MUSIC_TRACKS } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [editingTrack, setEditingTrack] = useState<Partial<MusicTrack>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tableError, setTableError] = useState<string | null>(null);

  const loadTracks = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("music_tracks")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setTableError(
            error.code === "42P01"
              ? "The music_tracks table does not exist yet. Please run the migration SQL in your Supabase dashboard."
              : error.message
          );
          setTracks([]);
        } else {
          setTableError(null);
          setTracks((data || []) as MusicTrack[]);
        }
      });
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const openAdd = () => {
    setEditingTrack({
      title: "",
      artist: "",
      artwork_url: "",
      youtube_url: "",
      display_order: tracks.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertMusicTrackAction(editingTrack);
        setIsModalOpen(false);
        loadTracks();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Save failed");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this song from the playlist?")) return;
    startTransition(async () => {
      try {
        await deleteMusicTrackAction(id);
        loadTracks();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Delete failed");
      }
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            SOUND ARCHIVE // PLAYLIST
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            MUSIC PLAYLIST
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Songs displayed in the public playlist carousel. Add artwork URLs from iTunes, Spotify CDN, or upload via media uploader.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase hover:bg-white transition-colors"
        >
          + ADD SONG
        </button>
      </div>

      {/* Migration notice */}
      {tableError && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-3">
          <div className="font-bold flex items-center gap-2">
            <span>⚠ DATABASE TABLE PENDING MIGRATION</span>
          </div>
          <p>
            The <code className="bg-black/50 px-1 py-0.5 rounded font-mono text-amber-300">music_tracks</code> table does not exist in Supabase yet.
            The portfolio is currently actively rendering all <strong>{DEFAULT_MUSIC_TRACKS.length} songs</strong> directly from your configured playlist.
          </p>
          <details className="cursor-pointer">
            <summary className="text-[#FFE500] font-bold hover:underline">
              Show migration SQL to run in Supabase SQL Editor →
            </summary>
            <pre className="mt-2 p-3 bg-black/80 text-green-300 text-[10px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 border border-white/10">{MIGRATION_SQL}</pre>
          </details>
        </div>
      )}

      {/* Track list */}
      {(() => {
        const displayTracks = tracks.length > 0 ? tracks : DEFAULT_MUSIC_TRACKS;
        return (
          <div className="space-y-4">
            <div className="text-xs font-mono text-white/40 flex items-center justify-between">
              <span>ACTIVE PLAYLIST SONGS ({displayTracks.length})</span>
              {tableError && <span className="text-[#FFE500]">ACTIVE PREVIEW (FROM SEED)</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayTracks.length === 0 ? (
                <div className="col-span-full text-xs text-white/40 py-12 text-center bg-[#0a0a0a] border border-white/10">
                  No songs added yet. Click &quot;+ ADD SONG&quot; to build your playlist.
                </div>
              ) : (
                displayTracks.map((track) => (
              <div
                key={track.id}
                className="p-4 bg-[#0a0a0a] border border-white/10 flex gap-3 items-start"
              >
                {/* Circular artwork preview */}
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                  {track.artwork_url ? (
                    <img
                      src={track.artwork_url}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#222] flex items-center justify-center text-white/30 text-lg font-black">
                      {track.title[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[10px] text-[#FFE500] uppercase">
                    #{track.display_order}
                  </div>
                  <h2 className="text-sm font-bold text-white uppercase leading-tight truncate">
                    {track.title}
                  </h2>
                  <p className="text-[10px] text-white/50 uppercase truncate">
                    {track.artist}
                  </p>
                  {track.youtube_url && (
                    <a
                      href={track.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-[#FFE500]/60 hover:text-[#FFE500] truncate block"
                    >
                      ▶ YouTube
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0 mt-1">
                  <button
                    onClick={() => {
                      setEditingTrack(track);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-[10px] border border-white/20 hover:border-[#FFE500] text-white/70 hover:text-[#FFE500]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="px-2.5 py-1 text-[10px] border border-red-500/30 text-red-400 hover:bg-red-950/40"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
              )}
            </div>
          </div>
        );
      })()}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              {editingTrack.id ? "EDIT SONG" : "ADD SONG TO PLAYLIST"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">SONG TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingTrack.title || ""}
                    onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value.toUpperCase() })}
                    placeholder="BLINDING LIGHTS"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">ARTIST NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingTrack.artist || ""}
                    onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value.toUpperCase() })}
                    placeholder="THE WEEKND"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">ALBUM ARTWORK URL</label>
                <input
                  type="url"
                  value={editingTrack.artwork_url || ""}
                  onChange={(e) => setEditingTrack({ ...editingTrack, artwork_url: e.target.value })}
                  placeholder="https://... (paste iTunes/Spotify CDN URL)"
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
                <p className="text-[9px] text-white/30 mt-0.5">
                  Tip: Search on iTunes: itunes.apple.com/search?term=SONG+ARTIST&entity=song&limit=1 and copy artworkUrl100 (replace 100x100bb with 600x600bb).
                </p>
              </div>

              <MediaUploader
                label="OR UPLOAD ARTWORK FROM DEVICE"
                value=""
                onChange={(url) => setEditingTrack({ ...editingTrack, artwork_url: url })}
                accept="image/*"
              />

              {/* Live artwork preview */}
              {editingTrack.artwork_url && (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={editingTrack.artwork_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">Artwork preview</span>
                </div>
              )}

              <div>
                <label className="block text-white/60 mb-1">YOUTUBE URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={editingTrack.youtube_url || ""}
                  onChange={(e) => setEditingTrack({ ...editingTrack, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    min={1}
                    value={editingTrack.display_order || 1}
                    onChange={(e) => setEditingTrack({ ...editingTrack, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">PUBLISHED</label>
                  <select
                    value={editingTrack.published ? "true" : "false"}
                    onChange={(e) => setEditingTrack({ ...editingTrack, published: e.target.value === "true" })}
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  >
                    <option value="true">Yes — visible on public site</option>
                    <option value="false">No — hidden from public</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-white/20 text-white/70 hover:border-white/50"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-1.5 bg-[#FFE500] text-[#030303] font-bold uppercase hover:bg-white disabled:opacity-50"
                >
                  {isPending ? "SAVING..." : "SAVE SONG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// SQL to display if the table is missing
const MIGRATION_SQL = "-- =========================================================================\n-- MUSIC TRACKS TABLE\n-- Stores individual songs for Muhammed Shanid's playlist carousel.\n-- =========================================================================\n\nCREATE TABLE IF NOT EXISTS public.music_tracks (\n    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    title TEXT NOT NULL,\n    artist TEXT NOT NULL,\n    artwork_url TEXT,          -- Direct image URL (Spotify CDN, Supabase storage, etc.)\n    youtube_url TEXT,          -- Track link (Spotify/YouTube)\n    display_order INT DEFAULT 0 NOT NULL,\n    published BOOLEAN DEFAULT true NOT NULL,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- RLS\nALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;\n\n-- Public can read published tracks\nCREATE POLICY \"Public can view published music tracks\"\n    ON public.music_tracks FOR SELECT\n    USING (published = true);\n\n-- Authenticated admin has full access\nCREATE POLICY \"Admin full access to music tracks\"\n    ON public.music_tracks FOR ALL\n    TO authenticated\n    USING (true)\n    WITH CHECK (true);\n\n-- Seed with Shanid's actual Spotify playlist tracks\nINSERT INTO public.music_tracks (title, artist, artwork_url, youtube_url, display_order, published) VALUES\n('Fairytale', 'Alexander Rybak', 'https://i.scdn.co/image/ab67616d0000b27349a39e0e4102b862ccee0fb0', 'https://open.spotify.com/track/3MnAsEBBsEj86d03RgO4EM', 1, true),\n('Amsham - അംശം', 'Aksomaniac, M.H.R, Bhumi, Circle Tone', 'https://i.scdn.co/image/ab67616d0000b273530e627d6b4aced65e1ccf4a', 'https://open.spotify.com/track/0Dt5EqEckM8jcfMYEdlx2Z', 2, true),\n('KALYANI (with Shreya Ghoshal) - Remix', 'ARJN, KDS, FIFTY4, Shreya Ghoshal', 'https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d', 'https://open.spotify.com/track/2y8mkajKikV5S1PRCMQ5WL', 3, true),\n('KALYANI', 'ARJN, KDS, FIFTY4, RONN', 'https://i.scdn.co/image/ab67616d0000b2739aa819fdf84c78fc1976391d', 'https://open.spotify.com/track/5HeHLpZfNKSfInznFSiO3v', 4, true),\n('KALYANI', 'ARJN, KDS, FIFTY4, RONN', 'https://i.scdn.co/image/ab67616d0000b2738c681e9dd49d13f7d223f8bf', 'https://open.spotify.com/track/2Uyj6K6mSaFTZsPvov415i', 5, true),\n('Ishq de Fanniyar - Female Version', 'Jyotica Tangri, Shaarib Toshi, Kumaar', 'https://i.scdn.co/image/ab67616d0000b2738bcaf08c344aa0f7b169fa25', 'https://open.spotify.com/track/6JARNpkUypyzQEltxZM95O', 6, true),\n('Bina Tere Na Ek Pal Ho', 'Neelima Prajith', 'https://i.scdn.co/image/ab67616d0000b27394441ba11dedf800f4bc6142', 'https://open.spotify.com/track/0d5TbOAXIoZbQBiK9Qv1M4', 7, true),\n('Theher Ja', 'Garvit - Priyansh, Garvit Soni, Priyansh Srivastava, Aniket Shukla', 'https://i.scdn.co/image/ab67616d0000b273b9b56a91fa328950bc1b05ac', 'https://open.spotify.com/track/62G4WNFaG4HlsD5it4kgsw', 8, true),\n('The Fate of Ophelia', 'Taylor Swift', 'https://i.scdn.co/image/ab67616d0000b273d7812467811a7da6e6a44902', 'https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W', 9, true),\n('Moral of the Story', 'Ashe', 'https://i.scdn.co/image/ab67616d0000b273b11a359d135e3b8ef86d370c', 'https://open.spotify.com/track/0zSxpn1s0nk6VMpBMNqNFa', 10, true),\n('I Wanna Be Yours', 'Arctic Monkeys', 'https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163', 'https://open.spotify.com/track/5XeFesFbtLpXzIVDNQP22n', 11, true),\n('Njanezhuthiya (Nee)', 'Levin Muthukad', 'https://i.scdn.co/image/ab67616d0000b27357b6bc1a0f3217ddb1e27a43', 'https://open.spotify.com/track/59Jshu3xecoxU0qZuboDeF', 12, true),\n('Wildest Dreams', 'Taylor Swift', 'https://i.scdn.co/image/ab67616d0000b273b7e976d2b35c767f9012cb72', 'https://open.spotify.com/track/3fVnlF4pGqWI9flVENcT28', 13, true),\n('Hridayathin Niramayi', 'Ashbel Peter, Samiya', 'https://i.scdn.co/image/ab67616d0000b273e29d723c6847c6338d2db3e7', 'https://open.spotify.com/track/5uxlrMoKZrfgZgMzmZIfls', 14, true),\n('KAANAAN ULLILULLA BHAYAMMO', 'Anusree Suresh', 'https://i.scdn.co/image/ab67616d0000b273d3c9e2c3113826ea704f2582', 'https://open.spotify.com/track/1LB9qtABIVp4CuVveToUiA', 15, true),\n('Nahin Milta', 'Bayaan', 'https://i.scdn.co/image/ab67616d0000b273ad5efa017cf3bc257a8147f7', 'https://open.spotify.com/track/5mUgHyCt7fZy7li4wt4Uq2', 16, true),\n('Suzume', 'RADWIMPS, Toaka', 'https://i.scdn.co/image/ab67616d0000b273bc16d1eefe86b079c8805f8f', 'https://open.spotify.com/track/1n1y2kFPISpF9WGD3JaFo5', 17, true),\n('Ennile Punchiri (Lofi Flip)', 'Sam C.S., Kapil Kapilan, K. S. Chithra, VIBIE', 'https://i.scdn.co/image/ab67616d0000b273586b878e1e5516498379f1bd', 'https://open.spotify.com/track/4RMmzwYIc3pypUUZ9VtTHx', 18, true),\n('Falling Apart', 'OG Brar', 'https://i.scdn.co/image/ab67616d0000b27300891e511096c26cbee5bb34', 'https://open.spotify.com/track/32KpjQdvWIdXzykAvngVUv', 19, true),\n('Jhol', 'Maanu, Annural Khalid', 'https://i.scdn.co/image/ab67616d0000b273da7d1408f8e776063963572f', 'https://open.spotify.com/track/4XTgFBxBHN6var1BzAgE1m', 20, true),\n('Why Me', 'Manhar, Richie', 'https://i.scdn.co/image/ab67616d0000b273612042946c11d0f810d7cd46', 'https://open.spotify.com/track/6e4KOkUi3vWU3vp0px1YpT', 21, true),\n('Sammi Meri Waarr', 'Muskan Chandalia, NZEEEE, Gagan, Perfecto', 'https://i.scdn.co/image/ab67616d0000b273f8c36f62cb11f14426e750ff', 'https://open.spotify.com/track/4KMMTcGfArahzaxD1MADyi', 22, true),\n('Anbarey (From &quot;Gulu Gulu&quot;)', 'Santhosh Narayanan, Dhee', 'https://i.scdn.co/image/ab67616d0000b273b578bfa4b91f3d0300020730', 'https://open.spotify.com/track/78xl1agm6jjt1u7YvgWtLo', 23, true),\n('Radhimaa - From &quot;Think Indie&quot;', 'Sai Abhyankkar, Nargis Teji, Asma Teji, Vivek, Sai Smriti', 'https://i.scdn.co/image/ab67616d0000b27324a93a0b07380c034f7d9d74', 'https://open.spotify.com/track/6jJHYbJReFfR2ieGzRP5bq', 24, true),\n('Alaakaa Loova Unplugged (From &quot;OM Chapter 1: Udhiram - The Blood Wood&quot;) [Tamil]', 'Sai Abhyankkar, Rokesh', 'https://i.scdn.co/image/ab67616d0000b273ca2efa994564dc3df504b40c', 'https://open.spotify.com/track/4mAv9CWBlfLSkzOtdTxdX0', 25, true),\n('ZILL', 'M.H.R, Shafi Kollam, JOKER390P', 'https://i.scdn.co/image/ab67616d0000b2732c3e5c303364018cf32045f7', 'https://open.spotify.com/track/12wlJpuAbgMv0OaYmY3r5x', 26, true),\n('Asalayavale', 'Jakes Bejoy, Sid Sriram, Mohammed Maqbool Mansoor, Muthu', 'https://i.scdn.co/image/ab67616d0000b273382cd7dba59a869f917d9170', 'https://open.spotify.com/track/5hR2s2JMTPeeorKuezGexs', 27, true),\n('Kinginichar', 'M.H.R, JOKER390P', 'https://i.scdn.co/image/ab67616d0000b2730cada67ed6914c22b9227f00', 'https://open.spotify.com/track/0ZdCs8N8qF5bBozuOGH56r', 28, true),\n('Majboor', 'Sheheryar Rehan, Zoha Waseem', 'https://i.scdn.co/image/ab67616d0000b273ba7861fdb5826a0038078c23', 'https://open.spotify.com/track/0lp3WWhjxFVUht81AQmWX8', 29, true),\n('End of Pookale', 'Vera Aristotle', 'https://i.scdn.co/image/ab67616d0000b273e890fa041873212b1f6ba57e', 'https://open.spotify.com/track/3oeMPVi6Dnnaww2omeqKRo', 30, true)\nON CONFLICT DO NOTHING;\n";

