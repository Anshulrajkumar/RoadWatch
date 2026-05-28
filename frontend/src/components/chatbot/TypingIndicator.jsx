import { motion } from "framer-motion";

const TypingIndicator = () => (
  <div className="flex items-start gap-2 px-4 py-3">
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-accent">
      RW
    </div>
    <div className="rounded-2xl rounded-tl-md bg-[#1a2d4d] px-4 py-3">
      <motion.div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-2 w-2 rounded-full bg-accent"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  </div>
);

export default TypingIndicator;
