import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getIcon } from '../utils/iconMapper';
import { formatCurrency } from '../utils/amountFormatter';

const TransactionCard = ({ transaction, onDelete, onEdit }) => {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flat-card group relative overflow-hidden flex items-center justify-between gap-4 py-3"
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary shrink-0">
          {getIcon(transaction.categoryIcon, { size: 18 })}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 text-base line-clamp-1 leading-tight mb-0.5">
            {transaction.remark || transaction.category}
          </h4>
          <div className="text-[12px] text-gray-500 flex items-center gap-1.5">
            <span className="font-bold">{displayTime(transaction.time)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
            <span className="truncate font-medium">{transaction.category}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 min-w-0 max-w-[55%] flex flex-col items-end">
        <p 
          className={`font-bold text-base leading-tight ${isIncome ? 'text-emerald-500' : 'text-rose-500'} truncate w-full`}
          title={(amount || 0).toLocaleString()}
        >
          {isIncome ? '+' : '-'} {formatCurrency(amount || 0)}
        </p>
        <p 
          className="text-[10px] text-gray-400 mt-0.5 font-bold truncate w-full"
          title={(transaction.balance || 0).toLocaleString()}
        >
          {formatCurrency(transaction.balance || 0)}
        </p>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all bg-white/90 backdrop-blur-sm p-1 rounded-full border border-gray-100">
        <button
          onClick={() => onEdit(transaction)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
          title="Edit"
        >
          <HiOutlinePencil size={16} />
        </button>
        <button
          onClick={() => onDelete(transaction._id || transaction.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          title="Delete"
        >
          <HiOutlineTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
