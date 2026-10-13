"use client";

import { useState, useTransition, useEffect } from "react";
import { markMessageReadAction, deleteMessageAction } from "@/lib/actions";
import type { Message } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadMessages = () => {
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages((data || []) as Message[]));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = (msg: Message) => {
    startTransition(async () => {
      await markMessageReadAction(msg.id, !msg.read);
      loadMessages();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: !msg.read });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Permanently delete this inquiry?")) return;
    startTransition(async () => {
      await deleteMessageAction(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      loadMessages();
    });
  };

  const filtered = messages.filter((m) => (filter === "unread" ? !m.read : true));

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-[#FFE500] tracking-widest uppercase mb-1">
            COMMUNICATIONS // INBOX
          </div>
          <h1 className="text-3xl font-black uppercase text-[#F2F2F2]">
            CONTACT INQUIRIES
          </h1>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 border ${
              filter === "all"
                ? "bg-[#FFE500] text-[#030303] border-[#FFE500] font-bold"
                : "border-white/20 text-white/70"
            }`}
          >
            ALL ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 border ${
              filter === "unread"
                ? "bg-[#FFE500] text-[#030303] border-[#FFE500] font-bold"
                : "border-white/20 text-white/70"
            }`}
          >
            UNREAD ({messages.filter((m) => !m.read).length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-[#0a0a0a] border border-white/10 text-xs text-white/40">
              No inquiries found in this view.
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.read) {
                    markMessageReadAction(msg.id, true).then(() => loadMessages());
                  }
                }}
                className={`p-4 bg-[#0a0a0a] border cursor-pointer transition-colors ${
                  selectedMessage?.id === msg.id
                    ? "border-[#FFE500] bg-white/[0.04]"
                    : msg.read
                    ? "border-white/10 opacity-70"
                    : "border-white/30 font-bold"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-pulse" />
                  )}
                </div>
                <div className="text-xs text-white uppercase">{msg.name}</div>
                <div className="text-[11px] text-[#FFE500] truncate">{msg.subject || "(No subject)"}</div>
                <div className="text-[10px] text-white/50 truncate mt-1">{msg.message}</div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-6 min-h-[350px]">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase">
                    {selectedMessage.subject || "No Subject"}
                  </h2>
                  <div className="text-xs text-[#FFE500] mt-1">
                    FROM: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    RECEIVED: {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="px-2.5 py-1 border border-white/20 text-[11px] hover:border-[#FFE500]"
                  >
                    {selectedMessage.read ? "MARK UNREAD" : "MARK READ"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-2.5 py-1 border border-red-500/30 text-red-400 text-[11px] hover:bg-red-950/40"
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="text-sm text-white/90 leading-relaxed font-sans whitespace-pre-wrap py-2">
                {selectedMessage.message}
              </div>

              <div className="pt-4 border-t border-white/5">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || "Portfolio Inquiry"
                  )}`}
                  className="inline-block px-5 py-2 bg-[#FFE500] text-[#030303] font-bold text-xs uppercase hover:bg-white transition-colors"
                >
                  REPLY VIA EMAIL ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-white/30 text-center py-20">
              Select an inquiry on the left to read full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
