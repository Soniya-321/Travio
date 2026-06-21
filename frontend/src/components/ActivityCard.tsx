import React from 'react';
import { Activity } from '../types';
import { Trash2, Sun, Moon } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onDelete: () => void;
}

export default function ActivityCard({ activity, onDelete }: ActivityCardProps) {
  const getTimeBadge = (time: string) => {
    switch (time) {
      case 'Morning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Sun className="w-3.5 h-3.5" />
            Morning
          </span>
        );
      case 'Afternoon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/25">
            <Sun className="w-3.5 h-3.5" />
            Afternoon
          </span>
        );
      case 'Evening':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/25">
            <Moon className="w-3.5 h-3.5" />
            Evening
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {getTimeBadge(activity.timeOfDay)}
          <h4 className="font-bold text-slate-150 text-base">{activity.title}</h4>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{activity.description}</p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
        <div className="flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-sm">
          <span>${activity.estimatedCostUSD} USD</span>
        </div>

        <button
          onClick={onDelete}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          title="Delete Activity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
