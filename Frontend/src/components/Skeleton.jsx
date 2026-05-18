import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ROMAN_URDU_QUOTES = [
  "Rukhein, check kar rahe hain ke saare paise kahaan gayab ho gaye... 🤔💸",
  "Ameer ban'ne ki acting shuru ho rahi hai, hosla rakhein... 😎💼",
  "Samosa khane se pehle ka zaroori hisaab kitaab... 🥮",
  "Wallet ro raha hai, isse pehle ke budget seedha karlein! 😭📉",
  "Hisaab kitaab lag raha hai, doston ka udhaar chukane ka waqt aa gaya! 🏃‍♂️💨"
];

const Skeleton = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ROMAN_URDU_QUOTES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 px-6 z-[9999]">
      <div className="w-full max-w-[320px] flex flex-col items-center justify-center text-center">

        {/* Glow & Animated App Logo */}
        <div className="relative mb-6">
          {/* Subtle Soft Pulsing Glow */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-3 rounded-3xl bg-primary/20 filter blur-md"
          />

          {/* Actual Logo Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{
              initial: { duration: 0.5, ease: "easeOut" },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            className="relative w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md border border-slate-100 p-2 overflow-hidden"
          >
            <img
              src="/logo.png"
              alt="Ginnti Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </motion.div>
        </div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-black text-slate-800 tracking-wide">
            Ginnti
          </h1>
          <p className="text-[9px]   text-primary font-bold">
            Aapka Apna Digital Hisaab
          </p>
        </motion.div>

        {/* Elegant Light Progress Bar */}
        <div className="w-32 h-[3px] bg-slate-200 rounded-full overflow-hidden mt-6 mb-5">
          <motion.div
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-primary rounded-full"
          />
        </div>

        {/* Dynamic Comedy Roman Urdu Message */}
        <div className="h-10 flex items-center justify-center">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-bold text-slate-600 italic max-w-[260px] leading-relaxed"
          >
            {ROMAN_URDU_QUOTES[quoteIndex]}
          </motion.p>
        </div>

        {/* Secure Ledger Badge */}
        {/* <p className="absolute bottom-6 text-[8px] text-slate-400 font-bold   ">
          ⚡ Smart & Secure Ledger ⚡
        </p> */}

      </div>
    </div>
  );
};

export default Skeleton;
