import React, { useMemo } from 'react';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { HiOutlinePlus, HiOutlineChartBar, HiOutlineMenuAlt2, HiRefresh } from 'react-icons/hi';

// Stores
import { useAuthStore } from '../store/useAuthStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useUIStore } from '../store/useUIStore';

const Dashboard = ({ onAddClick, onStatsClick, onDeleteRequest, onEditRequest, onViewAll, onMenuClick }) => {
  const user = useAuthStore(s => s.user);
  const transactions = useTransactionStore(s => s.transactions);
  const isSyncing = useUIStore(s => s.isSyncing);

  const totals = useMemo(() => {
    const cashIn = transactions.reduce((sum, t) => sum + (t.cashIn || 0), 0);
    const cashOut = transactions.reduce((sum, t) => sum + (t.cashOut || 0), 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayTotals = transactions.filter(t => t.date === today).reduce((acc, t) => {
      acc.cashIn += (t.cashIn || 0);
      acc.cashOut += (t.cashOut || 0);
      return acc;
    }, { cashIn: 0, cashOut: 0 });

    return {
      balance: cashIn - cashOut,
      todayCashIn: todayTotals.cashIn,
      todayCashOut: todayTotals.cashOut
    };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 15);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    recentTransactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [recentTransactions]);

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
      {/* Sticky Header & Summary Section */}
      <div className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md pt-6 pb-4 space-y-5 border-b border-gray-100">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 active:bg-gray-50 transition-colors"
            >
              <HiOutlineMenuAlt2 size={20} />
            </button>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Overview</h1>
              <p className="text-xs text-gray-400 font-medium">Hello, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSyncing && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-gray-100 text-[10px] font-bold text-gray-400">
                <HiRefresh className="animate-spin text-primary" size={12} />
                <span>Syncing...</span>
              </div>
            )}
            <button
              onClick={onStatsClick}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
              title="Statistics"
            >
              <HiOutlineChartBar size={20} />
            </button>
            <button
              onClick={onAddClick}
              className="hidden lg:flex btn-flat items-center gap-2"
            >
              <HiOutlinePlus size={18} />
              <span>New transaction</span>
            </button>
          </div>
        </header>

        {/* Main Balance Card */}
        <SummaryCard
          title="Running Balance"
          amount={totals.balance}
          type="balance"
          size="large"
        />

        {/* Today's Summary */}
        <div className="grid grid-cols-2 gap-2">
          <SummaryCard
            title="Today In"
            amount={totals.todayCashIn}
            type="income"
          />
          <SummaryCard
            title="Today Out"
            amount={totals.todayCashOut}
            type="expense"
          />
        </div>
      </div>

      {/* Recent Transactions (Scrollable) */}
      <div className="space-y-4 pt-4 pb-10">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-gray-800">Recent activity</h3>
          <button
            onClick={onViewAll}
            className="text-primary text-xs font-bold"
          >
            View all
          </button>
        </div>

        <div className="space-y-6">
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a)).map(date => (
              <div key={date} className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 ml-1">
                  {getDateLabel(date)}
                </h4>
                <div className="space-y-1.5">
                  {groupedTransactions[date].map(t => (
                    <TransactionCard
                      key={t.id}
                      transaction={t}
                      onDelete={onDeleteRequest}
                      onEdit={onEditRequest}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs font-bold">No records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
