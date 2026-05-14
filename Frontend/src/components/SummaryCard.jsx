import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, amount, type = 'default', size = 'small' }) => {
  const getColors = () => {
    switch (type) {
      case 'income': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'expense': return 'text-danger bg-danger/10 border-danger/20';
      case 'balance': return amount >= 0 ? 'text-secondary bg-secondary/5' : 'text-danger bg-danger/5';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card flex flex-col justify-center ${isLarge ? 'p-3' : 'p-2'} min-w-[100px] flex-1`}
    >
      <span className="text-text-muted text-[11px] font-semibold  tracking-wider mb-0.5">{title}</span>
      <span className={`font-black ${isLarge ? 'text-xl' : 'text-base'} ${getColors().split(' ')[0]}`}>
        {amount < 0 ? '-' : ''}{Math.abs(amount).toLocaleString()}
      </span>
    </motion.div>
  );
};

export default SummaryCard;
