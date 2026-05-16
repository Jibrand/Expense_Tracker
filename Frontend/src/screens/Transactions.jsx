import React, { useState, useMemo } from 'react';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const Transactions = ({ onDeleteRequest }) => {
  const { transactions, categories } = useAppContext();
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
      {/* Sticky Header Section - Hardened */}
      <div className="sticky top-0 z-30 bg-background pt-3 pb-3 space-y-3 -mx-3 px-3 shadow-sm border-b border-border/10">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-main">History</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-white shadow-soft text-text-muted'}`}
          >
            <HiOutlineFilter size={18} />
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search remarks..."
            className="w-full pl-10 pr-3 py-2.5 bg-white rounded-lg shadow-soft border-none outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-2 rounded-md text-[11px] font-semibold transition-all ${filterCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-text-muted shadow-soft'
                }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.name)}
                className={`px-3 py-2 rounded-md text-[11px] font-semibold transition-all ${filterCategory === cat.name ? 'bg-primary text-white' : 'bg-white text-text-muted shadow-soft'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grouped Transactions List (Scrollable) */}
      <div className="space-y-5 pt-4 pb-10">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a)).map(date => (
            <div key={date} className="space-y-1.5">
              <h3 className="text-sm font-semibold text-text-muted  tracking-wider ml-1">
                {getDateLabel(date)}
              </h3>
              <div className="space-y-1">
                {groupedTransactions[date].map(t => (
                  <TransactionCard
                    key={t.id}
                    transaction={t}
                    onDelete={onDeleteRequest}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-text-muted text-sm font-medium">No records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
