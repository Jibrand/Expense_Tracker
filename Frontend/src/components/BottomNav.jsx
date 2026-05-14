import React from 'react';
import { HiOutlineHome, HiOutlineMenuAlt2, HiOutlineChartPie, HiOutlineCog, HiPlus, HiOutlineTag } from 'react-icons/hi';

const BottomNav = ({ activeTab, onTabChange, onAddClick }) => {
  const tabs = [
    { id: 'home', icon: HiOutlineHome, label: 'Home' },
    { id: 'transactions', icon: HiOutlineMenuAlt2, label: 'History' },
    { id: 'add', icon: HiPlus, label: 'Add', isSpecial: true },
    { id: 'categories', icon: HiOutlineTag, label: 'Categories' },
    { id: 'settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2  -translate-x-1/2 w-full max-w-[480px] glass-effect h-20 px-6 flex items-center justify-between z-50 rounded-t-3xl">
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

        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-primary/70'
              }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
