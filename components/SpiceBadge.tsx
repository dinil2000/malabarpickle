import React from 'react';
import { SpiceLevel } from '@/lib/types';

interface SpiceBadgeProps {
  level: SpiceLevel;
  className?: string;
}

export const SpiceBadge: React.FC<SpiceBadgeProps> = ({ level, className = '' }) => {
  const getSpiceInfo = (lvl: SpiceLevel) => {
    switch (lvl) {
      case 'Mild':
        return { label: 'Mild', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', peppers: '🌶️' };
      case 'Medium':
        return { label: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-300', peppers: '🌶️🌶️' };
      case 'Spicy':
        return { label: 'Spicy', color: 'bg-orange-100 text-orange-800 border-orange-300', peppers: '🌶️🌶️🌶️' };
      case 'Extra Hot':
        return { label: 'Fiery Hot', color: 'bg-red-100 text-red-800 border-red-300', peppers: '🔥🌶️🌶️🌶️' };
      default:
        return { label: level, color: 'bg-gray-100 text-gray-800 border-gray-300', peppers: '🌶️' };
    }
  };

  const info = getSpiceInfo(level);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${info.color} ${className}`}
    >
      <span>{info.peppers}</span>
      <span>{info.label}</span>
    </span>
  );
};

export const VegNonVegBadge: React.FC<{ isVeg: boolean }> = ({ isVeg }) => {
  return isVeg ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
      100% Pure Veg
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      <span className="w-2 h-2 rounded-full bg-red-600"></span>
      Non-Veg Special
    </span>
  );
};
