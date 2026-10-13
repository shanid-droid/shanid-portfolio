"use client";

import { useState, useTransition, useEffect } from "react";
import {
  upsertProjectAction,
  deleteProjectAction,
  reorderItemsAction,
} from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DEFAULT_PROJECTS, type Project } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const loadProjects = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(data as Project[]);
        }
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    startTransition(async () => {
      try {
        await upsertProjectAction(editingProject);
        setMessage("Project saved successfully.");
        setEditingProject(null);
        loadProjects();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to save project");
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      try {
        await deleteProjectAction(id);
        setMessage("Project deleted.");
        loadProjects();
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to delete project");
      }
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    setProjects(newProjects);

    startTransition(async () => {
      try {
        await reorderItemsAction(
          "projects",
          newProjects.map((p) => p.id)
        );
      } catch (err: unknown) {
        setMessage(err instanceof Error ? err.message : "Failed to reorder projects");
      }
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            PORTFOLIO // WORK
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            PROJECTS & PROTOTYPES
          </h1>
        </div>
        <button
          onClick={() =>
            setEditingProject({
              slug: `project-${Date.now()}`,
              title: "",
              category: "PROTOTYPE",
              status: "ACTIVE PROTOTYPE",
              description: "",
              tags: [],
              featured: false,
              published: true,
              display_order: projects.length + 1,
            })
          }
          className="px-5 py-2.5 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_16px_rgba(255,229,0,0.2)]"
        >
          + ADD NEW PROJECT
        </button>
      </div>

      {message && (
        <div className="p-3 bg-black border border-white/20 text-xs text-[#FFE500] flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-white/40 hover:text-white">✕</button>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className={`bg-[#0a0a0a] border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
              proj.published ? "border-white/10" : "border-dashed border-white/20 opacity-75"
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-white/50">
                <span className="text-[#FFE500]">0{idx + 1} //</span>
                <span>{proj.category}</span>
                <span>•</span>
                <span className={proj.published ? "text-emerald-400" : "text-amber-400"}>
                  {proj.published ? "PUBLISHED" : "DRAFT"}
                </span>
                {proj.featured && (
                  <span className="px-1.5 py-0.2 bg-[#FFE500]/10 text-[#FFE500] border border-[#FFE500]/30 text-[10px]">
                    FEATURED
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold uppercase text-[#F2F2F2] truncate">
                {proj.title}
              </h2>

              <p className="text-xs text-white/70 font-light line-clamp-2 max-w-2xl">
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-white/5 text-white/50 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Reordering */}
            <div className="flex items-center gap-2 self-end md:self-center font-mono text-xs">
              <div className="flex flex-col gap-1 mr-2">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0 || isPending}
                  className="px-2 py-1 bg-black border border-white/20 text-[10px] hover:border-[#FFE500] disabled:opacity-20"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === projects.length - 1 || isPending}
                  className="px-2 py-1 bg-black border border-white/20 text-[10px] hover:border-[#FFE500] disabled:opacity-20"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>

              <button
                onClick={() => setEditingProject(proj)}
                className="px-3 py-1.5 border border-white/20 hover:border-[#FFE500] hover:text-[#FFE500] transition-colors"
              >
                EDIT
              </button>
              <button
                onClick={() => handleDelete(proj.id, proj.title)}
                className="px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-950/40 transition-colors"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase text-[#FFE500]">
                {editingProject.id ? "EDIT PROJECT" : "CREATE NEW PROJECT"}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">SLUG (URL IDENTIFIER)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={editingProject.category || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    placeholder="e.g. SPATIAL SYSTEMS"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">STATUS BADGE</label>
                  <input
                    type="text"
                    value={editingProject.status || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, status: e.target.value })
                    }
                    placeholder="e.g. ACTIVE PROTOTYPE"
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">SHORT DESCRIPTION</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">LONG DESCRIPTION (OPTIONAL)</label>
                <textarea
                  rows={4}
                  value={editingProject.long_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, long_description: e.target.value })
                  }
                  placeholder="In-depth technical architecture, challenges, and implementation notes..."
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">DEMO / LIVE URL</label>
                  <input
                    type="url"
                    value={editingProject.demo_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, demo_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">REPO / SOURCE URL</label>
                  <input
                    type="url"
                    value={editingProject.repo_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, repo_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={editingProject.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="VR, Spatial Audio, Hardware, React"
                  className="w-full px-3 py-2 bg-black border border-white/20 text-white outline-none focus:border-[#FFE500]"
                />
              </div>

              <MediaUploader
                label="SCREENSHOT OR MEDIA ASSET"
                value={editingProject.screenshot_url || ""}
                onChange={(url) => setEditingProject({ ...editingProject, screenshot_url: url })}
              />

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.published ?? true}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, published: e.target.checked })
                    }
                    className="accent-[#FFE500]"
                  />
                  <span>PUBLISHED (VISIBLE TO PUBLIC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="accent-[#FFE500]"
                  />
                  <span>FEATURED ITEM</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-white/20 text-white/60 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-[#FFE500] text-[#030303] font-bold uppercase hover:bg-white"
                >
                  {isPending ? "SAVING..." : "SAVE PROJECT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
