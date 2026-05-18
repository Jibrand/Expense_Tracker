import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineMenuAlt2, HiOutlineTag, HiOutlineCog, HiOutlineChartPie, HiPlus, HiOutlineBookOpen, HiChevronDown, HiOutlinePlusSm, HiOutlineLogout } from 'react-icons/hi';
import { useAuthStore } from '../store/useAuthStore';
import { useBookStore } from '../store/useBookStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { books, activeBookId, setActiveBookId, addBook } = useBookStore();
  const [isBooksOpen, setIsBooksOpen] = React.useState(false);
  const [isAddingBook, setIsAddingBook] = React.useState(false);
  const [newBookName, setNewBookName] = React.useState('');
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBooksOpen(false);
        setIsAddingBook(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeBook = books.find(b => b._id === activeBookId) || books[0];

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBookName.trim()) return;
    await addBook(newBookName);
    setNewBookName('');
    setIsAddingBook(false);
    setIsBooksOpen(false);
    if (onClose) onClose();
  };

  const navItems = [
    { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/transactions', icon: HiOutlineMenuAlt2, label: 'Transactions' },
    { path: '/stats', icon: HiOutlineChartPie, label: 'Statistics' },
    { path: '/categories', icon: HiOutlineTag, label: 'Categories' },
    { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo Area */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Ginnti Logo" className="w-14 h-14 object-contain" />
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tight">Ginnti</h1>
              <p className="text-[10px] text-gray-400 font-bold  ">Expense Tracker</p>
            </div>
          </div>
        </div>

        {/* Book Selector */}
        <div className="px-4 py-6 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsBooksOpen(!isBooksOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${isBooksOpen ? 'bg-white border-primary' : 'bg-gray-50 border-transparent hover:border-gray-200'
              }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isBooksOpen ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-primary'}`}>
                <HiOutlineBookOpen size={16} />
              </div>
              <span className="text-sm font-bold text-gray-700 truncate">{activeBook?.name}</span>
            </div>
            <HiChevronDown className={`text-gray-400 transition-transform duration-200 ${isBooksOpen ? 'rotate-180 text-primary' : ''}`} />
          </button>

          <AnimatePresence>
            {isBooksOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute left-0 right-0 top-[calc(100%+4px)] z-[60] bg-white border border-gray-200 rounded-xl p-2 space-y-1"
              >
                <p className="text-[10px] font-bold text-gray-400 px-3 py-2">Select account</p>
                <div className="max-h-56 overflow-y-auto no-scrollbar space-y-0.5">
                  {books.map(book => (
                    <button
                      key={book._id}
                      onClick={() => {
                        setActiveBookId(book._id);
                        setIsBooksOpen(false);
                        if (onClose) onClose();
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-bold transition-all ${activeBookId === book._id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${activeBookId === book._id ? 'bg-white' : 'bg-primary'}`} />
                        {book.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 mt-2">
                  {isAddingBook ? (
                    <form onSubmit={handleAddBook} className="flex items-center gap-1">
                      <input
                        autoFocus
                        type="text"
                        className="flex-1 text-xs font-bold p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 placeholder:text-gray-400 min-w-0"
                        placeholder="Book name..."
                        value={newBookName}
                        onChange={(e) => setNewBookName(e.target.value)}
                      />
                      <button type="submit" className="p-2 bg-primary text-white rounded-lg shrink-0 flex items-center justify-center">
                        <HiPlus size={16} />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingBook(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-primary hover:bg-primary/5 transition-all"
                    >
                      <HiOutlinePlusSm size={18} />
                      Create new book
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <NavLink
                to={item.path}
                onClick={() => { if (onClose) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <item.icon size={19} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold">Standard Member</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                if (onClose) onClose();
              }}
              title="Logout"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shrink-0 border border-transparent hover:border-rose-100"
            >
              <HiOutlineLogout size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

