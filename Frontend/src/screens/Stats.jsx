import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { HiOutlineTag, HiOutlineClock, HiOutlineMenuAlt2 } from 'react-icons/hi';
import { format, startOfMonth, endOfMonth, subDays, isAfter, startOfYear, subMonths } from 'date-fns';

// Stores
import { useTransactionStore } from '../store/useTransactionStore';
import { useCategoryStore } from '../store/useCategoryStore';

const Stats = ({ onMenuClick }) => {
  const transactions = useTransactionStore(s => s.transactions);
  const categories = useCategoryStore(s => s.categories);

  const [timeRange, setTimeRange] = useState('This month');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const ranges = ['Last 7 days', 'Last 30 days', 'This month', 'Last month', 'This year', 'All time'];

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    if (selectedCategory !== 'All') {
      list = list.filter(t => t.category === selectedCategory);
    }

    const now = new Date();
    if (timeRange === 'Last 7 days') {
      const cutOff = subDays(now, 7);
      list = list.filter(t => isAfter(new Date(t.date), cutOff));
    } else if (timeRange === 'Last 30 days') {
      const cutOff = subDays(now, 30);
      list = list.filter(t => isAfter(new Date(t.date), cutOff));
    } else if (timeRange === 'This month') {
      const start = startOfMonth(now);
      list = list.filter(t => isAfter(new Date(t.date), start));
    } else if (timeRange === 'Last month') {
      const start = startOfMonth(subMonths(now, 1));
      const end = endOfMonth(subMonths(now, 1));
      list = list.filter(t => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
    } else if (timeRange === 'This year') {
      const start = startOfYear(now);
      list = list.filter(t => isAfter(new Date(t.date), start));
    }

    return list;
  }, [transactions, selectedCategory, timeRange]);

  const periodTotals = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => ({
      cashIn: acc.cashIn + (t.cashIn || 0),
      cashOut: acc.cashOut + (t.cashOut || 0)
    }), { cashIn: 0, cashOut: 0 });
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const total = filteredTransactions
        .filter(t => t.category === cat.name && t.cashOut > 0)
        .reduce((sum, t) => sum + t.cashOut, 0);
      return { name: cat.name, value: total, color: cat.color };
    }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories]);

  const kpis = useMemo(() => {
    const savingsRate = periodTotals.cashIn > 0 ? ((periodTotals.cashIn - periodTotals.cashOut) / periodTotals.cashIn) * 100 : 0;
    const daysInPeriod = new Set(filteredTransactions.map(t => t.date)).size || 1;
    const avgDaily = periodTotals.cashOut / daysInPeriod;

    return {
      savingsRate: Math.max(0, savingsRate).toFixed(1),
      avgDaily: Math.round(avgDaily)
    };
  }, [periodTotals, filteredTransactions]);

  const trendData = useMemo(() => {
    const uniqueDates = [...new Set(filteredTransactions.map(t => t.date))].sort().slice(-14);

    return uniqueDates.map(dateStr => {
      const dayTransactions = filteredTransactions.filter(t => t.date === dateStr);
      return {
        name: format(new Date(dateStr), 'MMM d'),
        out: dayTransactions.reduce((sum, t) => sum + (t.cashOut || 0), 0),
        in: dayTransactions.reduce((sum, t) => sum + (t.cashIn || 0), 0)
      };
    });
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
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
              <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
              <p className="text-xs text-gray-400 font-medium">Financial performance</p>
            </div>
          </div>
        </header>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="relative min-w-[140px]">
            <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700 outline-none appearance-none hover:border-gray-200 transition-colors cursor-pointer"
            >
              {ranges.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="relative min-w-[140px]">
            <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700 outline-none appearance-none hover:border-gray-200 transition-colors cursor-pointer"
            >
              <option value="All">All categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 ">Income</span>
            <p className="text-lg font-bold text-gray-800">{periodTotals.cashIn.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-rose-500 ">Expense</span>
            <p className="text-lg font-bold text-gray-800">{periodTotals.cashOut.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-blue-500 ">Savings</span>
            <p className="text-lg font-bold text-gray-800">{kpis.savingsRate}%</p>
          </div>
          <div className="bg-white p-3 border border-gray-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-500 ">Daily avg</span>
            <p className="text-lg font-bold text-gray-800">{kpis.avgDaily.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 pb-10">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-sm text-gray-800">Financial trend</h3>
          </div>
          <div className="h-[240px] w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="cIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#FFFFFF' }} />
                  <Area type="monotone" dataKey="in" stroke="#10B981" fillOpacity={1} fill="url(#cIn)" strokeWidth={2} />
                  <Area type="monotone" dataKey="out" stroke="#F43F5E" fillOpacity={1} fill="url(#cOut)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-50 rounded-xl border border-gray-100">No data available</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl">
            <h3 className="font-bold text-sm text-gray-800 mb-8">Expense distribution</h3>
            <div className="h-[240px] w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#FFFFFF' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-50 rounded-xl border border-gray-100">No category data</div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl">
            <h3 className="font-bold text-sm text-gray-800 mb-8">Top categories</h3>
            <div className="h-[240px] w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData.slice(0, 5)} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} width={80} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', background: '#FFFFFF' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {categoryData.slice(0, 5).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-50 rounded-xl border border-gray-100">No category data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
