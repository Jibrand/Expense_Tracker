import React, { useState, useMemo } from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlinePlus, HiOutlineMenuAlt2 } from 'react-icons/hi';
import TransactionCard from '../components/TransactionCard';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

// Stores
import { useTransactionStore } from '../store/useTransactionStore';
import { useCategoryStore } from '../store/useCategoryStore';

const Transactions = ({ onDeleteRequest, onEditRequest, onMenuClick }) => {
  const transactions = useTransactionStore(s => s.transactions);
  const categories = useCategoryStore(s => s.categories);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.remark?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, filterCategory]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const getDateLabel = (dateStr) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full">
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
            <h1 className="text-2xl font-bold text-gray-800">History</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl transition-all border flex items-center justify-center ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white border-gray-100 text-gray-400'}`}
            >
              <HiOutlineFilter size={18} />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search remarks..."
            className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-100 outline-none text-sm font-bold text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 py-1">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${filterCategory === 'All' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-100'
                }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id || cat._id}
                onClick={() => setFilterCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${filterCategory === cat.name ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-100'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grouped Transactions List (Scrollable) */}
      <div className="space-y-6 pt-4 pb-10">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a)).map(date => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 ml-1">
                {getDateLabel(date)}
              </h3>
              <div className="space-y-1.5">
                {groupedTransactions[date].map(t => (
                  <TransactionCard
                    key={t.id || t._id}
                    transaction={t}
                    onDelete={onDeleteRequest}
                    onEdit={onEditRequest}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-bold">No records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
