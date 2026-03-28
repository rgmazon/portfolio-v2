"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm an AI assistant for Rudolfh Mazon. Ask me anything — about his work, skills, projects, or if they're available to hire! 👋",
};

const SUGGESTED_QUESTIONS = [
  "Are you available for hire?",
  "What's your tech stack?",
  "Tell me about your projects",
];

export default function ChatBot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...next, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    sendMessage(text);
  }

  if (!mounted) return null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-13 h-13 rounded-full bg-(--violet) text-(--cream) shadow-lg hover:opacity-90 transition-all duration-200 cursor-pointer"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-88 max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden border border-(--border) bg-(--bg-surface) shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-(--border) bg-(--bg-darker)">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--violet)">
              <Bot size={16} className="text-(--cream)" />
            </div>
            <div>
              <p className="text-sm font-bold text-(--cream) uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                RG&apos;s Assistant
              </p>
              <p className="text-xs text-(--muted)">Powered by Groq</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`shrink-0 flex items-start justify-center w-7 h-7 rounded-full mt-0.5 ${
                    msg.role === "user"
                      ? "bg-(--border)"
                      : "bg-(--violet)"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={14} className="text-(--cream) mt-1.5" />
                  ) : (
                    <Bot size={14} className="text-(--cream) mt-1.5" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-(--violet) text-(--cream)"
                      : "bg-(--bg) text-(--cream-dim) border border-(--border)"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-(--muted) animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-(--muted) animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-(--muted) animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* Suggested questions — only shown before any user message */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-col gap-2 pt-1">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-3 py-2 rounded-full border border-(--border) text-(--cream-dim) hover:border-(--violet) hover:text-(--cream) transition-colors cursor-pointer bg-transparent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-(--border) bg-(--bg-darker)"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              disabled={loading}
              className="flex-1 bg-(--bg-surface) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--cream) placeholder-(--muted-dark) outline-none focus:border-(--violet) transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-(--violet) text-(--cream) hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
