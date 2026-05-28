import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

const API_URL = "http://localhost:4000/api/chatbot/message";

const ChatWindow = ({ onClose, currentPage }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("rw_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Persist chat history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("rw_chat_history", JSON.stringify(messages));
    } catch { /* ignore quota errors */ }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isTyping) return;

    const newUserMsg = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
          currentPage,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Please check your connection and try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("rw_chat_history");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 right-5 z-[9999] flex h-[540px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a37] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-navy px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-navy">
            RW
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Road<span className="text-accent">Watch</span> Assistant
            </p>
            <p className="text-[10px] text-white/50">AI-powered help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearChat}
            title="Clear chat"
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3" style={{ scrollBehavior: "smooth" }}>
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-2xl font-bold text-accent">
              RW
            </div>
            <p className="text-sm font-semibold text-white">
              Hi! I'm your Road<span className="text-accent">Watch</span> assistant.
            </p>
            <p className="mt-1 text-xs text-white/50">
              Ask me about roads, complaints, or navigating the platform.
            </p>
          </div>
        )}

        {messages.length === 0 && !isTyping && (
          <SuggestedPrompts onSelect={sendMessage} />
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Suggested prompts after some messages */}
      {messages.length > 0 && messages.length < 4 && !isTyping && (
        <SuggestedPrompts onSelect={sendMessage} />
      )}

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0d1e3a] px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about RoadWatch..."
            disabled={isTyping}
            className="flex-1 bg-transparent py-2 text-sm text-white placeholder-white/30 outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-navy transition hover:bg-accent/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;
