import React, { useState } from 'react';
import { HiPlus, HiOutlineX } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import { getIcon } from '../utils/iconMapper';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
  const { categories, addCategory } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName);
      setNewCatName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-30 bg-background pt-3 pb-3 space-y-3 -mx-3 px-3 shadow-sm border-b border-border/10">

        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-main">Categories</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="p-2.5 bg-primary text-white rounded-xl shadow-lg active:scale-95 transition-all"
          >
            <HiPlus size={20} />
          </button>
        </header>

        {/* Add Category Input Overlay (Tight) */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd}
              className="card flex items-center gap-3 overflow-hidden p-3"
            >
              <input
                type="text"
                autoFocus
                placeholder="Category name"
                className="flex-1 bg-background p-2.5 rounded-xl text-sm font-medium outline-none border border-border/50"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" className="text-primary font-semibold text-sm px-2">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="text-text-muted p-1">
                <HiOutlineX size={20} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="card flex items-center gap-3 p-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shadow-sm"
                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
              >
                {getIcon(cat.icon, { size: 20 })}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main leading-tight">{cat.name}</p>
                <p className="text-[10px] font-semibold text-text-muted  tracking-wider">category</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
