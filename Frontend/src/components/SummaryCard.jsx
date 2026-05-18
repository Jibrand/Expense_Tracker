import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/amountFormatter';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flat-card flex flex-col justify-center ${isLarge ? 'p-6 bg-primary/5 border-primary/20' : 'p-4 bg-white'} min-w-0 flex-1`}
    >
      <span className="text-gray-400 text-xs font-bold mb-1 truncate">{title}</span>
      <span 
        className={`${isLarge ? 'text-3xl' : 'text-xl'} font-bold ${getColors().split(' ')[0]} truncate`}
        title={amount.toLocaleString()}
      >
        {formatCurrency(amount)}
      </span>
    </motion.div>
  );
};

export default SummaryCard;
