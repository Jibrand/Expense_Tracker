import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineCalendar } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { categories, addTransaction } = useAppContext();

  const [type, setType] = useState('cashOut');
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    remark: '',
    category: 'Other',
    amount: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const categoryObj = categories.find(c => c.name === formData.category) || categories[categories.length - 1];

    const transaction = {
      ...formData,
      time: format(new Date(), 'hh:mm aa'),
      cashIn: type === 'cashIn' ? (parseFloat(formData.amount) || 0) : 0,
      cashOut: type === 'cashOut' ? (parseFloat(formData.amount) || 0) : 0,
      categoryIcon: categoryObj.icon,
      amount: parseFloat(formData.amount) || 0,
      mode: 'Cash',
      entryBy: 'Jibran',
      contact: ''
    };

    addTransaction(transaction);
    onClose();
    setFormData({
      ...formData,
      remark: '',
      amount: '',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-[300px] rounded-xl p-3.5 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[12px] font-semibold text-text-main uppercase">New entry</h2>
            <button onClick={onClose} className="p-1 hover:bg-background rounded-full transition-colors">
              <HiOutlineX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Toggle Type */}
            <div className="flex bg-background p-1 rounded-lg border border-border/20">
              <button
                type="button"
                onClick={() => setType('cashIn')}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${type === 'cashIn' ? 'bg-secondary text-white shadow-md' : 'text-text-muted hover:text-text-main'
                  }`}
              >
                Cash In
              </button>
              <button
                type="button"
                onClick={() => setType('cashOut')}
                className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${type === 'cashOut' ? 'bg-danger text-white shadow-md' : 'text-text-muted hover:text-text-main'
                  }`}
              >
                Cash Out
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1 px-1">
              <label className="text-[10px] font-semibold text-text-muted uppercase">Amount ()</label>
              <input
                type="number"
                required
                placeholder="0"
                className="w-full text-3xl font-semibold py-1 bg-transparent border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-border"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 px-1">
                <label className="text-[10px] font-semibold text-text-muted uppercase">Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-background rounded-lg border border-border/20 outline-none text-[10px] font-semibold text-text-main"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-1 px-1">
                <label className="text-[10px] font-semibold text-text-muted uppercase">Category</label>
                <select
                  className="w-full p-2 bg-background rounded-lg border border-border/20 outline-none text-[10px] font-semibold text-text-main appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1 px-1">
              <label className="text-[10px] font-semibold text-text-muted uppercase">Remark</label>
              <input
                type="text"
                placeholder="Details"
                className="w-full p-2 bg-background rounded-lg border border-border/20 outline-none text-[10px] font-semibold text-text-main"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              />
            </div>

            <button type="submit" className="bg-primary text-white py-3 rounded-xl text-[12px] font-semibold shadow-xl shadow-primary/20 active:scale-95 transition-all w-full">
              Save record
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
