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
    <div className="space-y-3">
      <div className="sticky top-0 z-30 bg-background pt-3 pb-3 space-y-3 -mx-3 px-3 shadow-sm border-b border-border/10">

        <header>
          <h1 className="text-2xl font-semibold text-text-main">Settings</h1>
        </header>

        {/* Profile Section */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-base text-slate-800">General Settings</h3>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-text-muted ml-1  tracking-wider">Default entry by</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 bg-background rounded-xl border-none outline-none text-sm font-semibold text-slate-700 shadow-inner"
                value={settings.entryBy}
                onChange={(e) => setSettings({ ...settings, entryBy: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-base text-slate-800">Data Management</h3>

          <button
            onClick={exportToCSV}
            className="w-full flex items-center justify-between p-4 bg-background rounded-xl hover:bg-primary/5 transition-colors group border border-transparent hover:border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-active:scale-90">
                <HiOutlineDownload size={22} />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-slate-700">Export to CSV</p>
                <p className="text-xs font-medium text-text-muted">Download all records</p>
              </div>
            </div>
          </button>
        </div>

        <div className="py-8 text-center space-y-1">
          <p className="text-xs text-text-muted font-semibold tracking-tight">Daily Expense Tracker v2.0</p>
          <p className="text-[11px] text-text-muted font-medium italic opacity-70">Designed for Jibran</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
