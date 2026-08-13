import React from 'react';
import { Atom } from 'lucide-react';

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Đang tải dữ liệu Vật Lí...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-sky-200 border-t-sky-600 animate-spin" />
        <Atom className="w-6 h-6 text-sky-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-xs text-slate-500 font-medium tracking-wide animate-pulse">{text}</p>
    </div>
  );
};

