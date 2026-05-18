import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineDownload, HiOutlineUser, HiOutlineLogout, HiOutlinePlus, HiOutlineCheckCircle, HiOutlineX, HiOutlineMenuAlt2 } from 'react-icons/hi';

// Stores
import { useAuthStore } from '../store/useAuthStore';
import { useBookStore } from '../store/useBookStore';
import { useTransactionStore } from '../store/useTransactionStore';

const Settings = ({ onMenuClick }) => {
  const { books, settings, setSettings, addBook, deleteBook } = useBookStore();
  const transactions = useTransactionStore(s => s.transactions);
  const { user, logout } = useAuthStore();

  // Local state for settings to enable manual save
  const [localEntryBy, setLocalEntryBy] = useState(settings.entryBy || '');
  const [newBookName, setNewBookName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalEntryBy(settings.entryBy || '');
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await setSettings({ ...settings, entryBy: localEntryBy });
    setIsSaving(false);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBookName.trim()) return;
    addBook(newBookName);
    setNewBookName('');
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Book', 'Date', 'Time', 'Remark', 'Category', 'Cash In', 'Cash Out', 'Balance'];
    const rows = transactions.map(t => {
      const book = books.find(b => b._id === t.bookId);
      return [
        book ? book.name : 'Unknown',
        t.date,
        t.time,
        t.remark,
        t.category,
        t.cashIn,
        t.cashOut,
        t.balance
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully');
  };

  const hasChanges = localEntryBy !== settings.entryBy;

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
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-xs text-gray-400 font-medium">Preferences & account</p>
            </div>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              <HiOutlineCheckCircle size={16} />
              <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
            </button>
          )}
        </header>
      </div>

      <div className="space-y-6 pt-6 pb-10">
        {/* Profile Section */}
        <div className="flat-card space-y-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-800">General settings</h3>
            <span className="text-[10px] font-bold text-gray-300 ">Configuration</span>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 ml-1">Default entry by</label>
            <div className="relative group">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none text-sm font-bold text-gray-700 focus:border-primary/30 focus:bg-white transition-all"
                value={localEntryBy}
                onChange={(e) => setLocalEntryBy(e.target.value)}
                placeholder="Enter name..."
              />
            </div>
          </div>
        </div>

        {/* Books Management Section */}
        <div className="flat-card space-y-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-800">Manage books</h3>
            <span className="text-[10px] font-bold text-gray-300 ">Ledgers</span>
          </div>

          <form onSubmit={handleAddBook} className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="New book name..."
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:border-primary/30 focus:bg-white transition-all"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
              />
              {newBookName && (
                <button
                  type="button"
                  onClick={() => setNewBookName('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiOutlineX size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-bold active:scale-95 transition-all">
              Add
            </button>
          </form>

          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto no-scrollbar">
            {books.map(book => (
              <div key={book._id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-bold text-gray-700">{book.name}</span>
                </div>
                {books.length > 1 && (
                  <button
                    onClick={() => deleteBook(book._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 text-xs font-bold px-2 py-1 hover:bg-rose-50 rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="flat-card space-y-6 bg-white">
          <h3 className="font-bold text-sm text-gray-800">Data management</h3>

          <button
            onClick={exportToCSV}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors group border border-gray-100 hover:border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-primary flex items-center justify-center transition-transform group-active:scale-90 shadow-sm">
                <HiOutlineDownload size={22} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-700">Export to CSV</p>
                <p className="text-[11px] font-medium text-gray-400">Download all records for external use</p>
              </div>
            </div>
          </button>
        </div>

        {/* Account Section */}
        <div className="flat-card space-y-6 bg-white">
          <h3 className="font-bold text-sm text-gray-800">Account</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800 leading-none mb-1">{user?.name}</p>
                <p className="text-[11px] font-medium text-gray-400">{user?.email}</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-primary">Member</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-50 text-rose-500 rounded-xl text-sm font-bold active:scale-95 transition-all mt-2 border border-rose-100"
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </div>

        <div className="py-8 text-center space-y-1">
          <p className="text-[10px] text-gray-300 font-bold   ">Ginnti v2.5</p>
          <p className="text-[11px] text-gray-300 font-medium italic">Handcrafted for {user?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
