import React, { useState } from 'react';
import { HiPlus, HiOutlineX, HiOutlinePencil, HiOutlineTrash, HiOutlineMenuAlt2 } from 'react-icons/hi';
import { getIcon } from '../utils/iconMapper';
import { motion, AnimatePresence } from 'framer-motion';

// Stores
import { useCategoryStore } from '../store/useCategoryStore';
import { useTransactionStore } from '../store/useTransactionStore';

const Categories = ({ onMenuClick }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const transactions = useTransactionStore(s => s.transactions);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [editName, setEditName] = useState('');

  const [usageTransactions, setUsageTransactions] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName);
      setNewCatName('');
      setIsAdding(false);
    }
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    if (editName.trim()) {
      updateCategory(id, { name: editName });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = (id, name) => {
    const linkedTransactions = transactions.filter(t => t.category === name);
    
    if (linkedTransactions.length > 0) {
      setUsageTransactions({ name, list: linkedTransactions });
      return;
    }

    if (window.confirm(`Delete "${name}" category?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Usage Warning Modal */}
      <AnimatePresence>
        {usageTransactions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 space-y-6 shadow-2xl border border-gray-100"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Cannot delete category</h3>
                <p className="text-sm text-gray-500">
                  The category <span className="font-bold text-primary">"{usageTransactions.name}"</span> is currently used by {usageTransactions.list.length} transactions. Please re-categorize or delete these transactions first.
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto no-scrollbar border border-gray-100 rounded-xl bg-gray-50 p-2 space-y-2">
                {usageTransactions.list.map(t => (
                  <div key={t._id || t.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-50 shadow-sm">
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-700">{t.remark || 'No remark'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{t.date}</p>
                    </div>
                    <p className={`text-xs font-bold ${t.cashIn > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.cashIn > 0 ? `+${t.cashIn}` : `-${t.cashOut}`}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setUsageTransactions(null)}
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold active:scale-95 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md pt-6 pb-4 space-y-4 border-b border-gray-100">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 active:bg-gray-50 transition-colors"
            >
              <HiOutlineMenuAlt2 size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
              <p className="text-xs text-gray-400 font-medium">Manage classifications</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary hover:border-primary transition-all"
            title="Add Category"
          >
            <HiPlus size={20} />
          </button>
        </header>

        {/* Add Category Input Overlay */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd}
              className="flat-card flex items-center gap-3 overflow-hidden p-3 bg-white"
            >
              <input
                type="text"
                autoFocus
                placeholder="Category name"
                className="flex-1 bg-gray-50 p-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none border border-gray-100"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" className="text-primary font-bold text-sm px-2">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 p-1">
                <HiOutlineX size={20} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 pb-10">
        {categories.map(cat => (
          <div key={cat._id || cat.id} className="flat-card flex items-center justify-between p-4 group bg-white">
            {editingId === (cat._id || cat.id) ? (
              <form onSubmit={(e) => handleUpdate(e, cat._id || cat.id)} className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  className="flex-1 bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 outline-none"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button type="submit" className="text-primary text-xs font-bold">Save</button>
                <button type="button" onClick={() => setEditingId(null)} className="text-gray-400">
                  <HiOutlineX size={18} />
                </button>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{ backgroundColor: `${cat.color}10`, borderColor: `${cat.color}30`, color: cat.color }}
                  >
                    {getIcon(cat.icon, { size: 24 })}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{cat.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">classification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(cat._id || cat.id);
                      setEditName(cat.name);
                    }}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id || cat.id, cat.name)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
