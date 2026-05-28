import { motion } from "framer-motion";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-2 px-4 py-1.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser
            ? "bg-accent text-navy"
            : "bg-navy text-accent"
        }`}
      >
        {isUser ? "You" : "RW"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-md bg-accent text-navy font-medium"
            : "rounded-tl-md bg-[#1a2d4d] text-white/90"
        }`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <div className="chatbot-markdown" dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
        )}
      </div>
    </motion.div>
  );
};

/** Lightweight markdown → HTML (bold, bullets, code) */
function formatMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 text-xs text-accent">$1</code>')
    .replace(/^[-•]\s+(.+)$/gm, '<li class="ml-3 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="space-y-0.5 my-1">${m}</ul>`)
    .replace(/\n/g, "<br />");
}

export default ChatMessage;
