import React from 'react';
import { HiOutlineHome, HiOutlineMenuAlt2, HiOutlineChartPie, HiOutlineCog, HiPlus, HiOutlineTag } from 'react-icons/hi';

import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: '/', icon: HiOutlineHome, label: 'Home' },
    { id: '/transactions', icon: HiOutlineMenuAlt2, label: 'History' },
    { id: 'add', icon: HiPlus, label: 'Add', isSpecial: true },
    { id: '/categories', icon: HiOutlineTag, label: 'Categories' },
    { id: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2  -translate-x-1/2 w-full max-w-[480px] glass-effect h-20 px-6 flex items-center justify-between z-50 rounded-t-3xl border-t border-white/20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        if (tab.isSpecial) {
          return (
            <button
              key={tab.id}
              onClick={onAddClick}
              className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/30 -mt-12 active:scale-90 transition-transform"
            >
              <Icon size={28} />
            </button>
          );
        }

        const isActive = location.pathname === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-text-muted hover:text-primary/70'
              }`}
          >
            <div className={`relative ${isActive ? 'after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full' : ''}`}>
              <Icon size={22} />
            </div>
            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
