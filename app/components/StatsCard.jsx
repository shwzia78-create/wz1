import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'success',
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 sm:p-5 rounded-lg shadow-xs border border-[#E1E3E5] transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#10B981] hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </div>
        {badgeText && (
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
            badgeType === 'critical' ? 'bg-orange-100 text-orange-700' :
            badgeType === 'warning' ? 'bg-amber-100 text-amber-800' :
            'bg-[#E3F2ED] text-[#008060]'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1.5">
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
          badgeType === 'critical' && typeof value === 'number' && value > 0 ? 'text-orange-600' : 'text-[#202223]'
        }`}>
          {value}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded bg-[#F1F2F4] flex items-center justify-center text-gray-500 shrink-0">
            <Icon className="w-4 h-4 text-[#008060]" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        {change && (
          <span className={`font-medium flex items-center gap-0.5 ${
            isPositive ? 'text-[#008060]' : 'text-orange-600'
          }`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        {subtitle && (
          <span className="text-gray-400 font-mono text-[11px] truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
