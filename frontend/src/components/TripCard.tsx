import React from 'react';
import { Trip } from '../types';
import { MapPin, Calendar, Trash2 } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function TripCard({ trip, isActive, onSelect, onDelete }: TripCardProps) {
  const getBudgetBadge = (tier: string) => {
    switch (tier) {
      case 'Low':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Low Budget
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
            Mid Budget
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            High Budget
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isActive
          ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2.5">
          <div
            className={`p-2 rounded-xl border transition-colors ${
              isActive
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                : 'bg-slate-850 border-slate-700 text-slate-400 group-hover:text-indigo-400'
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-1">
              {trip.destination}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {trip.durationDays} {trip.durationDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button (only visible on hover or active state) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete Trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800/60">
        <div className="flex flex-wrap gap-1">
          {trip.interests.slice(0, 2).map((interest, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] rounded-md bg-slate-800 text-slate-400 border border-slate-800"
            >
              {interest}
            </span>
          ))}
          {trip.interests.length > 2 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-md text-slate-500">
              +{trip.interests.length - 2}
            </span>
          )}
        </div>
        {getBudgetBadge(trip.budgetTier)}
      </div>
    </div>
  );
}
