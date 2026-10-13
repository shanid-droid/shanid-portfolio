"use client";

import { useState, useTransition, useEffect } from "react";
import { upsertParticipationAction, deleteParticipationAction } from "@/lib/actions";
import type { Participation } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminParticipationsPage() {
  const [items, setItems] = useState<Participation[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Participation>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("participations")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => setItems((data || []) as Participation[]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertParticipationAction(editingItem);
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
            ACTIVITIES // MILESTONES
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            PARTICIPATED PROGRAMS & EVENTS
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingItem({
              title: "",
              organization_or_event: "",
              role_or_type: "HACKATHON / EVENT",
              date: "",
              description: "",
              display_order: items.length + 1,
              published: true,
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase hover:bg-white"
        >
          + ADD EVENT
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-xs text-white/40 py-8 text-center bg-[#0a0a0a] border border-white/10">
            No participated programs or events added yet. Click &quot;+ ADD EVENT&quot; to add.
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 bg-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="text-[11px] text-white/40 mb-1">
                  <span className="text-[#FFE500]">0{idx + 1} //</span> {item.role_or_type} • {item.date}
                </div>
                <h2 className="text-lg font-bold uppercase text-white">{item.title}</h2>
                <div className="text-xs text-[#FFE500]">{item.organization_or_event}</div>
                {item.description && (
                  <p className="text-xs text-white/60 font-light mt-1">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 border border-white/20 hover:border-[#FFE500]"
                >
                  EDIT
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this event record?")) {
                      startTransition(async () => {
                        await deleteParticipationAction(item.id);
                        loadData();
                      });
                    }
                  }}
                  className="px-3 py-1.5 border border-red-500/30 text-red-400"
                >
                  DELETE
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
              {editingItem.id ? "EDIT PROGRAM / EVENT" : "ADD PROGRAM / EVENT"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 mb-1">PROGRAM / EVENT TITLE</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div>
                <label className="block text-white/60 mb-1">ORGANIZATION / HOST</label>
                <input
                  type="text"
                  required
                  value={editingItem.organization_or_event || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, organization_or_event: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/60 mb-1">ROLE / TYPE</label>
                  <input
                    type="text"
                    value={editingItem.role_or_type || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, role_or_type: e.target.value })}
                    placeholder="Speaker / Finalist"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">DATE / TIMEFRAME</label>
                  <input
                    type="text"
                    value={editingItem.date || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="Oct 2025"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/60 mb-1">SUMMARY (OPTIONAL)</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
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
