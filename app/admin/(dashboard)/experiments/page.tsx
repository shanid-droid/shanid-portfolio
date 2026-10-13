"use client";

import { useState, useTransition, useEffect } from "react";
import { upsertExperimentAction, deleteExperimentAction } from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { Experiment } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminExperimentsPage() {
  const [items, setItems] = useState<Experiment[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Experiment>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("experiments")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setItems((data || []) as Experiment[]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertExperimentAction(editingItem);
        setIsModalOpen(false);
        loadData();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Save failed");
      }
    });
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            R&D // LAB CONCEPTS
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            EXPERIMENTS, IDEAS & ONGOING WORK
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingItem({
              title: "",
              type: "ai_experiment",
              status: "IN PROGRESS",
              description: "",
              display_order: items.length + 1,
              published: true,
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase hover:bg-white"
        >
          + ADD EXPERIMENT / IDEA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-xs text-white/40 py-8 text-center bg-[#0a0a0a] border border-white/10">
            No experiments or ideas recorded yet. Click &quot;+ ADD EXPERIMENT / IDEA&quot; to begin.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-[#0a0a0a] border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-white/40 mb-1">
                  <span className="text-[#FFE500] uppercase">{item.type.replace("_", " ")}</span>
                  <span className="px-1.5 py-0.5 border border-white/10 text-[10px] text-white/60">
                    {item.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white uppercase">{item.title}</h2>
                <p className="text-xs text-white/70 font-light mt-1.5">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className={item.published ? "text-emerald-400 text-[10px]" : "text-amber-400 text-[10px]"}>
                  {item.published ? "PUBLISHED" : "DRAFT"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 border border-white/20 hover:border-[#FFE500]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this experiment?")) {
                        startTransition(async () => {
                          await deleteExperimentAction(item.id);
                          loadData();
                        });
                      }
                    }}
                    className="px-2.5 py-1 border border-red-500/30 text-red-400"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-lg w-full p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              {editingItem.id ? "EDIT EXPERIMENT / IDEA" : "ADD EXPERIMENT / IDEA"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1">TITLE</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/60 mb-1">TYPE</label>
                  <select
                    value={editingItem.type || "ai_experiment"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        type: e.target.value as Experiment["type"],
                      })
                    }
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  >
                    <option value="ai_experiment">AI Experiment</option>
                    <option value="ongoing_work">Ongoing Work</option>
                    <option value="idea">Concept / Idea</option>
                    <option value="design">Design Study</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 mb-1">STATUS</label>
                  <input
                    type="text"
                    value={editingItem.status || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    placeholder="IN PROGRESS / LAB STUDY"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">EXTERNAL / PROTOTYPE LINK</label>
                <input
                  type="url"
                  value={editingItem.link_url || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, link_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <MediaUploader
                label="MEDIA ASSET (OPTIONAL)"
                value={editingItem.media_url || ""}
                onChange={(url) => setEditingItem({ ...editingItem, media_url: url })}
              />

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.published ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="accent-[#FFE500]"
                  />
                  <span>PUBLISHED (VISIBLE ON PUBLIC SITE)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
