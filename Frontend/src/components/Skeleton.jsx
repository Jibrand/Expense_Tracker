import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ROMAN_URDU_QUOTES = [
  "Aapka digital hisaab kitaab tayyar ho raha hai...",
  "Aik aik rupay ka hisaab, ab bilkul asan...",
  "Ginnti shuru ho rahi hai, hosla rakhein...",
  "Hisaab kitaab seedha, toh zindagi asan...",
  "Bachat ki taraf pehla qadam..."
];

const Skeleton = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROMAN_URDU_QUOTES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 px-6 z-[9999]">
      <div className="w-full max-w-[320px] flex flex-col items-center justify-center text-center">
        
        {/* Glow & Animated Icon */}
        <div className="relative mb-8">
          {/* Pulsing Outer Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 rounded-3xl bg-primary filter blur-md"
          />
          
          {/* App Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg border border-primary/20"
          >
            <span className="text-3xl text-white font-black select-none">G</span>
          </motion.div>
        </div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-wider">
            Ginnti
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
            Aapka Apna Digital Hisaab
          </p>
        </motion.div>

        {/* Custom Progress Bar */}
        <div className="w-36 h-[3px] bg-slate-800 rounded-full overflow-hidden mt-8 mb-6">
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
          />
        </div>

        {/* Dynamic Roman Urdu Proverb / Loading Message */}
        <div className="h-8 flex items-center justify-center">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-bold text-slate-300 italic max-w-[260px] leading-relaxed"
          >
            {ROMAN_URDU_QUOTES[quoteIndex]}
          </motion.p>
        </div>

        {/* Tiny offline notice indicator */}
        <p className="absolute bottom-6 text-[9px] text-slate-600 font-bold tracking-widest">
          SECURE & LOCAL STORAGE
        </p>

      </div>
    </div>
  );
};

export default Skeleton;
