"use client";

import { useState, useTransition, useEffect } from "react";
import { upsertSkillAction, deleteSkillAction } from "@/lib/actions";
import { DEFAULT_SKILLS, type Skill } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const loadSkills = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSkills(data as Skill[]);
        }
      });
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSkill) return;

    startTransition(async () => {
      try {
        await upsertSkillAction(editingSkill);
        setMessage("Skill saved.");
        setEditingSkill(null);
        loadSkills();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to save skill");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;

    startTransition(async () => {
      try {
        await deleteSkillAction(id);
        setMessage("Skill deleted.");
        loadSkills();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to delete skill");
      }
    });
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            CAPABILITIES // TOOLSTACK
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            TECHNICAL SKILLS
          </h1>
        </div>
        <button
          onClick={() =>
            setEditingSkill({
              category: "CORE WEB & GRAPHICS",
              name: "",
              level: "Advanced",
              display_order: skills.length + 1,
              published: true,
            })
          }
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_16px_rgba(255,229,0,0.2)]"
        >
          + ADD NEW SKILL
        </button>
      </div>

      {message && (
        <div className="p-3 bg-black border border-white/20 text-xs text-[#FFE500]">
          {message}
        </div>
      )}

      {/* Skills Grouped by Category */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              // {cat}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 bg-black border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="text-white font-medium">{skill.name}</div>
                      {skill.level && (
                        <div className="text-[10px] text-white/40">{skill.level}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingSkill(skill)}
                        className="px-2 py-1 border border-white/20 text-[10px] hover:border-[#FFE500]"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="px-2 py-1 border border-red-500/30 text-red-400 text-[10px] hover:bg-red-950/40"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-md w-full p-6 space-y-4">
            <div className="border-b border-white/10 pb-2 flex justify-between">
              <h2 className="text-sm font-bold uppercase text-[#FFE500]">
                {editingSkill.id ? "EDIT SKILL" : "ADD SKILL"}
              </h2>
              <button onClick={() => setEditingSkill(null)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1">SKILL NAME</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">CATEGORY</label>
                <input
                  type="text"
                  required
                  value={editingSkill.category || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  placeholder="e.g. CORE WEB & GRAPHICS"
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">PROFICIENCY LEVEL</label>
                <input
                  type="text"
                  value={editingSkill.level || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  placeholder="Advanced / Proficient / Intermediate"
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
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
