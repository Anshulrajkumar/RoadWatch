import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";

const ChatbotWidget = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            onClose={() => setIsOpen(false)}
            currentPage={currentPage}
          />
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-[0_8px_30px_rgba(234,162,42,0.35)] transition-colors hover:bg-[#f39a32]"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-navy"
            >
              <path d="M6.225 4.811a.75.75 0 00-1.06 1.06L10.939 12l-5.775 6.128a.75.75 0 001.06 1.06L12 13.063l5.775 6.128a.75.75 0 001.06-1.063L13.061 12l5.775-6.128a.75.75 0 00-1.06-1.06L12 10.938 6.225 4.812z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-navy"
            >
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.29 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.68-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring when closed */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-[9998] h-14 w-14 rounded-full bg-accent/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </>
  );
};

export default ChatbotWidget;
