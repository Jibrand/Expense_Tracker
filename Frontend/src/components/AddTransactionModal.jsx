import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import { format } from 'date-fns';

// Stores
import { useCategoryStore } from '../store/useCategoryStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useBookStore } from '../store/useBookStore';

const AddTransactionModal = ({ isOpen, onClose, editData = null }) => {
  const categories = useCategoryStore(s => s.categories);
  const addTransaction = useTransactionStore(s => s.addTransaction);
  const updateTransaction = useTransactionStore(s => s.updateTransaction);
  const activeBookId = useBookStore(s => s.activeBookId);

  const [type, setType] = useState('cashOut');
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    remark: '',
    category: 'Other',
    amount: '',
  });

  useEffect(() => {
    if (editData) {
      setType(editData.cashIn > 0 ? 'cashIn' : 'cashOut');
      setFormData({
        date: editData.date,
        remark: editData.remark || '',
        category: editData.category,
        amount: editData.amount.toString(),
      });
    } else {
      setType('cashOut');
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        remark: '',
        category: 'Other',
        amount: '',
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const categoryObj = categories.find(c => c.name === formData.category) || categories[categories.length - 1];

    const transaction = {
      ...formData,
      time: editData ? editData.time : format(new Date(), 'hh:mm aa'),
      cashIn: type === 'cashIn' ? (parseFloat(formData.amount) || 0) : 0,
      cashOut: type === 'cashOut' ? (parseFloat(formData.amount) || 0) : 0,
      categoryIcon: categoryObj.icon,
      amount: parseFloat(formData.amount) || 0,
      mode: 'Cash',
      entryBy: 'Jibran',
      contact: ''
    };

    if (editData) {
      updateTransaction(editData._id || editData.id, transaction, activeBookId);
    } else {
      addTransaction(transaction, activeBookId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-[340px] rounded-2xl p-5 border border-gray-100 overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">{editData ? 'Edit entry' : 'New entry'}</h2>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
              <HiOutlineX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Toggle Type */}
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setType('cashIn')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  type === 'cashIn' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Cash In
              </button>
              <button
                type="button"
                onClick={() => setType('cashOut')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  type === 'cashOut' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Cash Out
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Amount (PKR)</label>
              <input
                type="number"
                required
                placeholder="0"
                className="w-full text-3xl font-bold py-2 bg-transparent border-b-2 border-gray-100 focus:border-primary outline-none transition-colors placeholder:text-gray-200"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Date</label>
              <input
                type="date"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none text-sm font-bold text-gray-700 focus:border-primary/30 focus:bg-white transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Category</label>
              <div className="flex overflow-x-auto no-scrollbar gap-2 py-1 -mx-1 px-1">
                {categories.map(cat => (
                  <button
                    key={cat.id || cat._id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.category === cat.name
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 ml-1">Remark</label>
              <input
                type="text"
                placeholder="Details"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:border-primary/30 focus:bg-white transition-all"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gray-800 text-white rounded-xl text-sm font-bold active:scale-95 transition-all mt-2"
            >
              {editData ? 'Update record' : 'Save record'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
