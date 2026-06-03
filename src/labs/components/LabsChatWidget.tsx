import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { labsAiComplete } from "../api/labsAi";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: "api" | "mock";
}

export function LabsChatWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Labs assistant — ask about hydro diligence, corridor ops, or permitting. Demo-only; no production data.",
    },
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = pathname.startsWith("/labs");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!visible) return null;

  async function onSend(e: FormEvent) {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || sending) return;

    setInput("");
    setError(null);
    setSending(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: prompt }]);

    try {
      const result = await labsAiComplete({ task: "chat", prompt });
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: result.text,
          source: result.source,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex h-96 w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-xl border border-labs-border bg-labs-panel shadow-xl">
          <div className="flex items-center justify-between border-b border-labs-border bg-labs-panel2 px-3 py-2">
            <p className="text-sm font-semibold text-labs-text">Labs chat</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-labs-textMuted hover:text-labs-text"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={[
                  "rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "ml-6 bg-labs-accent/10 text-labs-text"
                    : "mr-6 border border-labs-border bg-white/90 text-labs-textMuted",
                ].join(" ")}
              >
                {msg.source === "mock" && msg.role === "assistant" && (
                  <p className="mb-1 text-[10px] font-labsMono uppercase text-labs-warning">Mock</p>
                )}
                {msg.text}
              </div>
            ))}
          </div>
          {error != null && (
            <p className="px-3 text-xs text-red-600">{error}</p>
          )}
          <form onSubmit={onSend} className="border-t border-labs-border p-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the labs assistant…"
                className="min-w-0 flex-1 rounded-md border border-labs-border px-2 py-1.5 text-sm focus:border-labs-accent/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="rounded-md bg-labs-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-labs-accent/40 bg-labs-accent px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-labs-accent/90"
      >
        {open ? "Close chat" : "Labs chat"}
      </button>
    </div>
  );
}
