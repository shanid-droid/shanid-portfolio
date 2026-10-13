"use client";

import { useState, useTransition, useEffect } from "react";
import { upsertInterestAction, deleteInterestAction } from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { Interest } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminInterestsPage() {
  const [items, setItems] = useState<Interest[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Interest>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("interests")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setItems((data || []) as Interest[]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertInterestAction(editingItem);
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
            PERSONAL // LIFE & INSPIRATIONS
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            HOBBIES, INTERESTS & MEMORIES
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingItem({
              title: "",
              category: "interest",
              description: "",
              display_order: items.length + 1,
              published: true,
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase hover:bg-white"
        >
          + ADD ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-xs text-white/40 py-8 text-center bg-[#0a0a0a] border border-white/10">
            No interests or photo memories added yet. Click &quot;+ ADD ITEM&quot; to add.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[#0a0a0a] border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-[10px] text-[#FFE500] uppercase mb-1">
                  // {item.category}
                </div>
                <h2 className="text-base font-bold text-white uppercase">{item.title}</h2>
                {item.description && (
                  <p className="text-xs text-white/60 font-light mt-1">{item.description}</p>
                )}
                {item.media_url && (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-32 object-cover mt-2 border border-white/10"
                  />
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2 text-xs">
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
                    if (confirm("Delete this entry?")) {
                      startTransition(async () => {
                        await deleteInterestAction(item.id);
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
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-md w-full p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#FFE500] border-b border-white/10 pb-2">
              {editingItem.id ? "EDIT ITEM" : "ADD ITEM"}
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

              <div>
                <label className="block text-white/60 mb-1">CATEGORY</label>
                <select
                  value={editingItem.category || "interest"}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value as Interest["category"],
                    })
                  }
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                >
                  <option value="hobby">Hobby / Activity</option>
                  <option value="interest">Interest / Topic</option>
                  <option value="memory">Memory / Photo Story</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1">NOTES (OPTIONAL)</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <MediaUploader
                label="PHOTO / MEDIA ATTACHMENT"
                value={editingItem.media_url || ""}
                onChange={(url) => setEditingItem({ ...editingItem, media_url: url })}
                accept="image/*"
              />

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
