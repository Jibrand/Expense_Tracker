import React from 'react';

const Skeleton = () => {
  return (
    <div className="mobile-container flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-[280px] space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/5 rounded-2xl animate-pulse" />
          <div className="space-y-2 text-center">
            <div className="w-32 h-4 bg-primary/5 rounded-full animate-pulse mx-auto" />
            <div className="w-24 h-2 bg-primary/5 rounded-full animate-pulse mx-auto opacity-50" />
          </div>
        </div>
        <div className="space-y-3 pt-10">
          <div className="w-full h-10 bg-primary/5 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
            <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
