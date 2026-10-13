"use client";

import { useState, useTransition } from "react";
import { uploadMediaAction } from "@/lib/actions";

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export function MediaUploader({
  value,
  onChange,
  label = "Upload Media Asset",
  accept = "image/*,video/*",
}: MediaUploaderProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const res = await uploadMediaAction(formData);
        if (res.error) {
          setError(res.error);
        } else if (res.url) {
          onChange(res.url);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-2 font-mono text-xs">
      <label className="block text-white/70 uppercase tracking-wider text-[11px]">
        {label}
      </label>

      {/* Current Preview */}
      {value && (
        <div className="p-3 bg-black/60 border border-white/10 rounded-sm flex items-center gap-4">
          {value.endsWith(".mp4") || value.includes("video") ? (
            <video
              src={value}
              className="w-20 h-14 object-cover bg-black border border-white/10"
              muted
              playsInline
            />
          ) : (
            <img
              src={value}
              alt="Uploaded asset preview"
              className="w-16 h-16 object-cover bg-black border border-white/10"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white/60 truncate text-[11px]">{value}</div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-red-400 hover:text-red-300 text-[10px] uppercase"
            >
              [ Remove Asset ]
            </button>
          </div>
        </div>
      )}

      {/* Upload & Direct URL Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isPending}
            className="hidden"
          />
          <div className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-[#FFE500] text-center text-white/60 hover:text-[#FFE500] transition-colors">
            {isPending ? "UPLOADING TO STORAGE..." : "CHOOSE LOCAL FILE (MAX 25MB)"}
          </div>
        </label>

        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste external/public URL..."
          className="flex-1 px-3 py-2 bg-black border border-white/10 focus:border-[#FFE500] text-white text-xs outline-none"
        />
      </div>

      {error && <div className="text-red-400 text-[10px]">{error}</div>}
    </div>
  );
}
