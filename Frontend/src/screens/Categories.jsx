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
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-main">Categories</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-primary text-white rounded-lg shadow-soft active:scale-95 transition-all"
        >
          <HiPlus size={16} />
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
            className="card flex items-center gap-2 overflow-hidden"
          >
            <input 
              type="text"
              autoFocus
              placeholder="Category name"
              className="flex-1 bg-background p-2 rounded-lg text-xs outline-none"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button type="submit" className="text-primary font-bold text-xs p-1">Add</button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-text-muted p-1">
              <HiOutlineX size={16} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="card flex items-center gap-2 p-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-primary shadow-sm"
              style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
            >
              {getIcon(cat.icon, { size: 16 })}
            </div>
            <div>
              <p className="text-[11px] font-bold text-text-main leading-tight">{cat.name}</p>
              <p className="text-[8px] text-text-muted">category</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
