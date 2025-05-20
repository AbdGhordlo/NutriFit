import React from "react";
import { motion } from "framer-motion";

interface MotivationalQuoteProps {
  quote: string;
  author: string;
}

const MotivationalQuote = ({ quote, author }: MotivationalQuoteProps) => (
  <motion.div
    className="quote-container bg-gradient-to-r from-teal-500 to-emerald-400 text-white p-6 rounded-xl"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.blockquote
      className="text-lg md:text-xl font-medium italic mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      "{quote}"
    </motion.blockquote>
    {author && (
      <motion.p
        className="text-right text-sm md:text-base font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        — {author}
      </motion.p>
    )}
  </motion.div>
);

export default MotivationalQuote;
