import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import { getIcon } from '../utils/iconMapper';

const TransactionCard = ({ transaction, onDelete }) => {
  const isIncome = transaction.cashIn > 0;
  const amount = isIncome ? transaction.cashIn : transaction.cashOut;

  // Helper to ensure time has AM/PM if missing (for old seed data)
  const displayTime = (time) => {
    if (!time) return '';
    if (time.includes('AM') || time.includes('PM')) return time;

    // Fallback for 24h old data
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="card group relative overflow-hidden p-2.5 border-none shadow-sm bg-white"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center text-primary shrink-0">
            {getIcon(transaction.categoryIcon, { size: 18 })}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-text-main text-sm line-clamp-1 leading-tight mb-0.5">
              {transaction.remark || transaction.category}
            </h4>
            <div className="text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="font-medium">{displayTime(transaction.time)}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-border"></span>
              <span className="truncate">{transaction.category}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className={`font-semibold text-sm leading-tight ${isIncome ? 'text-secondary' : 'text-danger'}`}>
            {isIncome ? '+' : '-'} {(amount || 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-text-muted mt-1 font-medium">
            PKR {(transaction.balance || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => onDelete(transaction.id)}
        className="absolute top-0 right-0 h-full w-10 bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <HiOutlineTrash size={16} />
      </button>
    </motion.div>
  );
};

export default TransactionCard;
