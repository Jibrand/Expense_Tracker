import React from 'react';
import { HiOutlineDownload, HiOutlineUser } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { transactions, settings, setSettings } = useAppContext();

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Date', 'Time', 'Remark', 'Category', 'Cash In', 'Cash Out', 'Balance'];
    const rows = transactions.map(t => [
      t.date,
      t.time,
      t.remark,
      t.category,
      t.cashIn,
      t.cashOut,
      t.balance
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold text-text-main">Settings</h1>
      </header>

      {/* Profile Section */}
      <div className="card space-y-3">
        <h3 className="font-bold text-sm">General Settings</h3>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted ml-1">Default entry by</label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              className="w-full pl-10 pr-3 py-2.5 bg-background rounded-xl border-none outline-none text-xs font-medium"
              value={settings.entryBy}
              onChange={(e) => setSettings({ ...settings, entryBy: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card space-y-3">
        <h3 className="font-bold text-sm">Data Management</h3>
        
        <button 
          onClick={exportToCSV}
          className="w-full flex items-center justify-between p-3 bg-background rounded-xl hover:bg-primary/5 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HiOutlineDownload size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Export to CSV</p>
              <p className="text-[10px] text-text-muted">Download all records</p>
            </div>
          </div>
        </button>
      </div>

      <div className="py-6 text-center">
        <p className="text-[10px] text-text-muted font-medium">Daily Expense Tracker v1.0</p>
        <p className="text-[10px] text-text-muted">Designed for Jibran</p>
      </div>
    </div>
  );
};

export default Settings;
