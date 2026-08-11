import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorGradient?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorGradient = 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
  badge,
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${colorGradient} border backdrop-blur-md transition hover:scale-[1.02] duration-200`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
          {subtitle && <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {badge && (
        <div className="mt-3">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
