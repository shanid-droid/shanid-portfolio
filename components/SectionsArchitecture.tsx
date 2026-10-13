"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { MusicCarousel } from "@/components/MusicCarousel";
import type {
  SiteSettings,
  Project,
  Skill,
  Education,
  Certificate,
  Participation,
  Experiment,
  Interest,
  MusicTrack,
} from "@/lib/types";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
} from "@/lib/types";
import { submitContactMessageAction } from "@/lib/actions";

interface SectionsArchitectureProps {
  settings?: SiteSettings;
  projects?: Project[];
  skills?: Skill[];
  education?: Education[];
  certificates?: Certificate[];
  participations?: Participation[];
  experiments?: Experiment[];
  interests?: Interest[];
  musicTracks?: MusicTrack[];
}

export function SectionsArchitecture({
  settings = DEFAULT_SITE_SETTINGS,
  projects = DEFAULT_PROJECTS,
  skills = DEFAULT_SKILLS,
  education = [],
  certificates = [],
  participations = [],
  experiments = [],
  interests = [],
  musicTracks = [],
}: SectionsArchitectureProps = {}) {
  // Contact form submission state
  const [isPending, startTransition] = useTransition();
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const res = await submitContactMessageAction(formData);
        if (res.error) {
          setFormError(res.error);
        } else {
          setFormSent(true);
          form.reset();
        }
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "Transmission failed");
      }
    });
  };

  const visibility = settings.sections_visibility || DEFAULT_SITE_SETTINGS.sections_visibility;
  const skillCategories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="relative z-20 w-full bg-[#030303] text-[#F2F2F2] font-sans border-t border-white/10">
      
      {/* ===================================================================== */}
      {/* 01 // PROJECTS SECTION                                                */}
      {/* ===================================================================== */}
      {visibility.projects !== false && (
        <section id="projects" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
                <span>01 // PROTOTYPES</span>
                <span className="w-1.5 h-1.5 bg-[#FFE500]" />
                <span>CORE WORK</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
                SELECTED PROJECTS
              </h2>
            </div>
            <div className="text-xs font-mono text-white/50 max-w-xs">
              Uninvented, honest documentation of active experiments, hardware rigs, and functional software prototypes.
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 hover:border-[#FFE500] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Corner accent marker */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-transparent group-hover:border-[#FFE500] transition-colors" />

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-3">
                    <span className="text-[#FFE500]">0{idx + 1} // {proj.category}</span>
                    <div className="flex items-center gap-1.5">
                      {proj.featured && (
                        <span className="px-1.5 py-0.5 bg-[#FFE500]/10 text-[#FFE500] border border-[#FFE500]/30 text-[10px]">
                          FEATURED
                        </span>
                      )}
                      <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase text-white/60">
                        {proj.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F2F2F2] group-hover:text-[#FFE500] transition-colors mb-3">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed font-light mb-4">
                    {proj.description}
                  </p>

                  {proj.screenshot_url && (
                    <div className="mb-4 overflow-hidden border border-white/10">
                      <img
                        src={proj.screenshot_url}
                        alt={proj.title}
                        className="w-full h-44 object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  {/* Action Links */}
                  {(proj.demo_url || proj.repo_url) && (
                    <div className="flex gap-3 mb-4 font-mono text-xs">
                      {proj.demo_url && (
                        <a
                          href={proj.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FFE500] hover:underline"
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {proj.repo_url && (
                        <a
                          href={proj.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-white hover:underline"
                        >
                          Repository ↗
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {proj.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-1 bg-white/5 text-white/60 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 02 // ABOUT & PHILOSOPHY SECTION                                      */}
      {/* ===================================================================== */}
      {visibility.about !== false && (
        <section id="about" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
                <span>02 // IDENTITY & DISCIPLINE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2] mb-6">
                ENGINEERING FOR TANGIBLE SENSATIONS
              </h2>
              <div className="p-4 bg-[#0a0a0a] border-l-2 border-[#FFE500] text-xs font-mono text-white/60 space-y-2">
                <div>// DISCIPLINE: Systems Engineering & XR Prototyping</div>
                <div>// OPERATING BASE: {settings.location}</div>
                <div>// STATUS: {settings.status_badge}</div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-white/80 font-light leading-relaxed text-base sm:text-lg">
              <p>
                I am <strong className="text-[#F2F2F2] font-semibold">{settings.name}</strong>, {settings.bio}
              </p>
              <p>
                My exploration spans building physical lighting nodes that translate software states into photons, 
                engineering audio-spatial VR experiments that rethink navigational accessibility without visual bias, 
                and architecting resilient web systems tuned for real-world devices.
              </p>
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 border border-white/10 bg-black/40">
                  <span className="text-white/40 block">FOCUS 01</span>
                  <span className="text-[#FFE500] font-bold">SPATIAL / XR</span>
                </div>
                <div className="p-3 border border-white/10 bg-black/40">
                  <span className="text-white/40 block">FOCUS 02</span>
                  <span className="text-[#FFE500] font-bold">PHYSICAL RIGS</span>
                </div>
                <div className="p-3 border border-white/10 bg-black/40">
                  <span className="text-white/40 block">FOCUS 03</span>
                  <span className="text-[#FFE500] font-bold">OPTIMIZED WEB</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 03 // SKILLS & ARCHITECTURE                                           */}
      {/* ===================================================================== */}
      {visibility.skills !== false && (
        <section id="skills" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
                <span>03 // CAPABILITIES</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
                SKILLS & TOOLSTACK
              </h2>
            </div>
            <div className="text-xs font-mono text-white/50">
              Hardware-aware software development & interaction design
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <div key={cat} className="p-6 bg-[#0a0a0a] border border-white/10 space-y-4">
                <h3 className="font-mono text-xs text-[#FFE500] tracking-wider uppercase">
                  // {cat}
                </h3>
                <ul className="space-y-2 text-sm text-white/80 font-mono">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((item) => (
                      <li key={item.id} className="flex items-center justify-between">
                        <span>• {item.name}</span>
                        {item.level && (
                          <span className="text-[10px] text-white/40">{item.level}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 04 // EDUCATION & CERTIFICATES (If added in CMS)                      */}
      {/* ===================================================================== */}
      {visibility.education !== false && (education.length > 0 || certificates.length > 0) && (
        <section id="education" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="border-b border-white/10 pb-6 mb-12">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
              <span>04 // BACKGROUND</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
              EDUCATION & CREDENTIALS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-[#FFE500] tracking-wider uppercase">
                  // FORMAL EDUCATION
                </h3>
                {education.map((edu) => (
                  <div key={edu.id} className="p-5 bg-[#0a0a0a] border border-white/10 space-y-1">
                    <div className="text-lg font-bold text-white uppercase">{edu.institution}</div>
                    <div className="text-xs text-[#FFE500] font-mono">
                      {edu.degree} {edu.field_of_study ? `— ${edu.field_of_study}` : ""}
                    </div>
                    <div className="text-[11px] text-white/40 font-mono">
                      {edu.start_date} {edu.end_date ? `to ${edu.end_date}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {certificates.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-[#FFE500] tracking-wider uppercase">
                  // CERTIFICATES & CREDENTIALS
                </h3>
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-5 bg-[#0a0a0a] border border-white/10 space-y-1">
                    <div className="text-base font-bold text-white uppercase">{cert.title}</div>
                    <div className="text-xs text-white/60 font-mono">{cert.issuer}</div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-[#FFE500] font-mono hover:underline pt-1"
                      >
                        Verify Credential ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 05 // PARTICIPATION & EVENTS (If added in CMS)                        */}
      {/* ===================================================================== */}
      {visibility.participation !== false && participations.length > 0 && (
        <section id="participation" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="border-b border-white/10 pb-6 mb-12">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
              <span>05 // MILESTONES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
              PARTICIPATION & PROGRAMS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participations.map((item) => (
              <div key={item.id} className="p-5 bg-[#0a0a0a] border border-white/10 space-y-1">
                <div className="text-[11px] font-mono text-white/40">
                  <span className="text-[#FFE500]">{item.role_or_type}</span> • {item.date}
                </div>
                <h3 className="text-lg font-bold text-white uppercase">{item.title}</h3>
                <div className="text-xs text-[#FFE500] font-mono">{item.organization_or_event}</div>
                {item.description && (
                  <p className="text-xs text-white/70 font-light pt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 06 // EXPERIMENTS & LAB STUDIES                                       */}
      {/* ===================================================================== */}
      {visibility.experiments !== false && experiments.length > 0 && (
        <section id="experiments" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="border-b border-white/10 pb-6 mb-12">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
              <span>06 // LAB ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
              EXPERIMENTS & ONGOING WORK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((item) => (
              <div key={item.id} className="p-6 bg-[#0a0a0a] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                    <span className="text-[#FFE500] uppercase">{item.type.replace("_", " ")}</span>
                    <span>{item.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mb-2">{item.title}</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed">{item.description}</p>
                </div>
                {item.link_url && (
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#FFE500] hover:underline"
                    >
                      Inspect Prototype ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 07 // INTERESTS & SPOTIFY (If added in CMS)                           */}
      {/* ===================================================================== */}
      {visibility.interests !== false && (interests.length > 0 || settings.spotify_playlist_url) && (
        <section id="interests" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="border-b border-white/10 pb-6 mb-12">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFE500] mb-2 tracking-widest">
              <span>07 // PERSONAL PERSPECTIVES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#F2F2F2]">
              INSPIRATIONS & MEMORIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interests.map((item) => (
              <div key={item.id} className="p-5 bg-[#0a0a0a] border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-[#FFE500] uppercase">// {item.category}</span>
                <h3 className="text-base font-bold text-white uppercase">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-white/70 font-light">{item.description}</p>
                )}
                {item.media_url && (
                  <img src={item.media_url} alt={item.title} className="w-full h-32 object-cover border border-white/10" />
                )}
              </div>
            ))}
            {settings.spotify_playlist_url && (
              <div className="p-5 bg-[#0a0a0a] border border-[#FFE500]/30 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#FFE500] uppercase">// SOUNDTRACK</span>
                  <h3 className="text-base font-bold text-white uppercase">CURATED SPOTIFY RIG</h3>
                  <p className="text-xs text-white/70 font-light">
                    The ambient, glitch, and synthesized soundscapes powering my deep-work coding sessions.
                  </p>
                </div>
                <a
                  href={settings.spotify_playlist_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FFE500] text-[#030303] text-xs font-mono font-bold uppercase text-center hover:bg-white"
                >
                  Listen on Spotify ↗
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 07.5 // MUSIC PLAYLIST CAROUSEL                                      */}
      {/* ===================================================================== */}
      <MusicCarousel tracks={musicTracks} />

      {/* ===================================================================== */}
      {/* 08 // CONTACT & INQUIRY FORM                                          */}
      {/* ===================================================================== */}
      {visibility.contact !== false && (
        <section id="contact" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-[#FFE500]/30 text-[#FFE500] text-xs font-mono tracking-widest">
                <span className="w-1.5 h-1.5 bg-[#FFE500] animate-pulse" />
                <span>COMMUNICATION CHANNEL READY</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#F2F2F2]">
                INITIALIZE CONTACT
              </h2>

              <p className="text-base text-white/70 font-light max-w-xl mx-auto">
                Open for experimental collaborations, systems engineering research, and spatial computing prototypes.
              </p>
            </div>

            {/* Inbound Contact Form (Directly saved to Supabase messages) */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 font-mono">
              {formSent ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <div className="text-[#FFE500] font-bold text-sm tracking-widest">
                    [ TRANSMISSION TRANSMITTED // SUCCESS ]
                  </div>
                  <p className="text-xs text-white/80">
                    Thank you. Your message has been encrypted and delivered directly to Muhammed Shanid&apos;s private CMS inbox.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="px-4 py-2 border border-white/20 text-xs hover:border-[#FFE500]"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Ada Lovelace"
                        className="w-full px-3 py-2 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 uppercase mb-1">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ada@domain.org"
                        className="w-full px-3 py-2 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 uppercase mb-1">Subject / Focus</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Prototype inquiry / XR collaboration"
                      className="w-full px-3 py-2 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 uppercase mb-1">Message Transmission</label>
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder="Outline your inquiry, hardware context, or collaborative project idea..."
                      className="w-full px-3 py-2 bg-black border border-white/20 focus:border-[#FFE500] text-white outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <span className="text-[10px] text-white/40">
                      Inquiries are stored privately in CMS. No third-party trackers.
                    </span>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full sm:w-auto px-8 py-3 bg-[#FFE500] text-[#030303] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                    >
                      {isPending ? "TRANSMITTING..." : "TRANSMIT MESSAGE →"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Links */}
            <div className="flex flex-wrap justify-center gap-4 font-mono text-xs">
              <a
                href={`mailto:${settings.contact_email}`}
                className="px-6 py-3 border border-white/20 hover:border-[#FFE500] hover:text-[#FFE500] text-white/80 transition-all uppercase"
              >
                DIRECT: {settings.contact_email}
              </a>
              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 border border-white/20 hover:border-[#FFE500] hover:text-[#FFE500] text-white/80 transition-all uppercase"
                >
                  GITHUB ↗
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 border border-white/20 hover:border-[#FFE500] hover:text-[#FFE500] text-white/80 transition-all uppercase"
                >
                  LINKEDIN ↗
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 gap-4">
              <div>{settings.footer_text}</div>
              <div className="flex items-center gap-3">
                <a href="/admin" className="text-white/30 hover:text-[#FFE500] transition-colors">
                  [ CMS ADMIN ]
                </a>
                <span>•</span>
                <span className="text-emerald-400">NEXT.JS 16 & REACT 19</span>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
