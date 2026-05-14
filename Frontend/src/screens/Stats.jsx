import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppContext } from '../context/AppContext';

const Stats = () => {
  const { transactions, categories } = useAppContext();

  // Category Breakdown Logic
  const categoryData = categories.map(cat => {
    const total = transactions
      .filter(t => t.category === cat.name && t.cashOut > 0)
      .reduce((sum, t) => sum + t.cashOut, 0);
    return { name: cat.name, value: total, color: cat.color };
  }).filter(item => item.value > 0);

  // Daily Trend Logic (Last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const totalOut = transactions
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + (t.cashOut || 0), 0);
    const totalIn = transactions
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + (t.cashIn || 0), 0);
    return { 
      name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      out: totalOut,
      in: totalIn,
      date: dateStr 
    };
  }).reverse();

  return (
    <div className="space-y-4 pb-10">
      <header>
        <h1 className="text-xl font-bold text-text-main">Statistics</h1>
        <p className="text-[10px] text-text-muted">Analytics for this month</p>
      </header>

      {/* Category Breakdown Pie Chart */}
      <div className="card">
        <h3 className="font-bold text-xs mb-3">Expenses by category</h3>
        <div className="h-[200px] w-full">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-[10px]">
              Not enough data for charts
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {categoryData.map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[9px] font-medium text-text-muted">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Trend Bar Chart */}
      <div className="card">
        <h3 className="font-bold text-xs mb-3">7-day trend</h3>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="out" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={15} />
              <Bar dataKey="in" fill="#22C55E" radius={[3, 3, 0, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
