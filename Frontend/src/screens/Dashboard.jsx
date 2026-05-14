import React from 'react';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { useAppContext } from '../context/AppContext';

const Dashboard = ({ onStatsClick, onDeleteRequest, onViewAll }) => {
  const { transactions, totals } = useAppContext();
  
  const recentTransactions = transactions.slice(0, 15);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header & Summary Section - Hardened */}
      <div className="sticky top-0 z-30 bg-background pt-3 pb-3 space-y-3 -mx-3 px-3 shadow-sm border-b border-border/10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-main leading-tight">Daily Expense</h1>
            <p className="text-[9px] text-text-muted">Welcome back, Jibran</p>
          </div>
          <button 
            onClick={onStatsClick}
            className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-soft text-lg"
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
      <div className="space-y-1.5 pt-4 pb-10">
        <div className="flex items-center justify-between px-0.5 mb-1">
          <h3 className="font-bold text-[10px] text-text-main uppercase tracking-tight">Recent activity</h3>
          <button 
            onClick={onViewAll}
            className="text-primary text-[9px] font-bold"
          >
            View all
          </button>
        </div>

        <div className="space-y-1">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(t => (
              <TransactionCard 
                key={t.id} 
                transaction={t} 
                onDelete={onDeleteRequest} 
              />
            ))
          ) : (
            <div className="py-8 text-center bg-card rounded-xl border border-dashed border-border/50">
              <p className="text-text-muted text-[10px]">No records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
