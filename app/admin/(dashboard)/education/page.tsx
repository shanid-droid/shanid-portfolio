"use client";

import { useState, useTransition, useEffect } from "react";
import {
  upsertEducationAction,
  deleteEducationAction,
  upsertCertificateAction,
  deleteCertificateAction,
} from "@/lib/actions";
import type { Education, Certificate } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [certList, setCertList] = useState<Certificate[]>([]);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const loadData = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setEducationList((data || []) as Education[]));

    supabase
      .from("certificates")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setCertList((data || []) as Certificate[]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEdu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEdu) return;

    startTransition(async () => {
      try {
        await upsertEducationAction(editingEdu);
        setMessage("Education record saved.");
        setEditingEdu(null);
        loadData();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  const handleSaveCert = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCert) return;

    startTransition(async () => {
      try {
        await upsertCertificateAction(editingCert);
        setMessage("Certificate saved.");
        setEditingCert(null);
        loadData();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <div className="space-y-10 font-mono">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            CREDENTIALS // BACKGROUND
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            EDUCATION & CERTIFICATES
          </h1>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-black border border-white/20 text-xs text-[#FFE500]">
          {message}
        </div>
      )}

      {/* Part 1: Education */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold uppercase text-[#FFE500]">
            // 01. EDUCATION HISTORY
          </h2>
          <button
            onClick={() =>
              setEditingEdu({
                institution: "",
                degree: "",
                field_of_study: "",
                start_date: "",
                end_date: "",
                description: "",
                display_order: educationList.length + 1,
                published: true,
              })
            }
            className="px-3 py-1 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase"
          >
            + ADD DEGREE
          </button>
        </div>

        {educationList.length === 0 ? (
          <div className="text-xs text-white/40 py-4 text-center">
            No education records added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="p-4 bg-black border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white uppercase">{edu.institution}</div>
                  <div className="text-xs text-[#FFE500]">
                    {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ""}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {edu.start_date} — {edu.end_date || "Present"}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setEditingEdu(edu)}
                    className="px-2.5 py-1 border border-white/20 hover:border-[#FFE500]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this education entry?")) {
                        startTransition(async () => {
                          await deleteEducationAction(edu.id);
                          loadData();
                        });
                      }
                    }}
                    className="px-2.5 py-1 border border-red-500/30 text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part 2: Certificates */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold uppercase text-[#FFE500]">
            // 02. VERIFIED CERTIFICATES & CREDENTIALS
          </h2>
          <button
            onClick={() =>
              setEditingCert({
                title: "",
                issuer: "",
                issue_date: "",
                credential_url: "",
                display_order: certList.length + 1,
                published: true,
              })
            }
            className="px-3 py-1 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase"
          >
            + ADD CERTIFICATE
          </button>
        </div>

        {certList.length === 0 ? (
          <div className="text-xs text-white/40 py-4 text-center">
            No certificates added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certList.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-black border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="text-white font-bold">{cert.title}</div>
                  <div className="text-white/50 text-[11px]">{cert.issuer}</div>
                  {cert.issue_date && (
                    <div className="text-white/40 text-[10px]">{cert.issue_date}</div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingCert(cert)}
                    className="px-2 py-1 border border-white/20 hover:border-[#FFE500]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this certificate?")) {
                        startTransition(async () => {
                          await deleteCertificateAction(cert.id);
                          loadData();
                        });
                      }
                    }}
                    className="px-2 py-1 border border-red-500/30 text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Modal */}
      {editingEdu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-md w-full p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              {editingEdu.id ? "EDIT EDUCATION" : "ADD EDUCATION"}
            </h2>
            <form onSubmit={handleSaveEdu} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1">INSTITUTION</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/60 mb-1">DEGREE</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.degree || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">FIELD OF STUDY</label>
                  <input
                    type="text"
                    value={editingEdu.field_of_study || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/60 mb-1">START DATE</label>
                  <input
                    type="text"
                    value={editingEdu.start_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                    placeholder="2022"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">END DATE</label>
                  <input
                    type="text"
                    value={editingEdu.end_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })}
                    placeholder="2026 / Present"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="px-3 py-1.5 border border-white/20"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-1.5 bg-[#FFE500] text-[#030303] font-bold uppercase"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-md w-full p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              {editingCert.id ? "EDIT CERTIFICATE" : "ADD CERTIFICATE"}
            </h2>
            <form onSubmit={handleSaveCert} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1">TITLE</label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">ISSUER / ORGANIZATION</label>
                <input
                  type="text"
                  required
                  value={editingCert.issuer || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">CREDENTIAL URL</label>
                <input
                  type="url"
                  value={editingCert.credential_url || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, credential_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-3 py-1.5 border border-white/20"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-1.5 bg-[#FFE500] text-[#030303] font-bold uppercase"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
