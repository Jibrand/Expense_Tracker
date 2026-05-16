import React, { useMemo } from 'react';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { useAppContext } from '../context/AppContext';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ onStatsClick, onDeleteRequest, onViewAll }) => {
  const { transactions, totals } = useAppContext();
  const { user } = useAuth();

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
      {/* Sticky Header & Summary Section - Hardened */}
      <div className="sticky top-0 z-30 bg-background pt-3 pb-3 space-y-3 -mx-3 px-3 shadow-sm border-b border-border/10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-main leading-tight">ExpenseTurkey</h1>
            <p className="text-xs text-text-muted">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={onStatsClick}
            className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-soft text-xl"
          >
            📊
          </button>
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
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-bold text-xs text-text-maintracking-tight">Recent activity</h3>
          <button
            onClick={onViewAll}
            className="text-primary text-[11px] font-bold"
          >
            View all
          </button>
        </div>

        <div className="space-y-5">
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a)).map(date => (
              <div key={date} className="space-y-1.5">
                <h4 className="text-sm font-bold text-text-mutedtracking-wider ml-1">
                  {getDateLabel(date)}
                </h4>
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
            <div className="py-8 text-center bg-card rounded-xl border border-dashed border-border/50">
              <p className="text-text-muted text-xs font-medium">No records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
