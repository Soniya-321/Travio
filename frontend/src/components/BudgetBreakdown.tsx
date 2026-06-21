import React from 'react';
import { EstimatedBudget } from '../types';
import { Plane, Hotel, UtensilsCrossed, Sparkles, DollarSign } from 'lucide-react';

interface BudgetBreakdownProps {
  budget: EstimatedBudget;
}

export default function BudgetBreakdown({ budget }: BudgetBreakdownProps) {
  const items = [
    { label: 'Flights', value: budget.flights, icon: Plane, color: 'text-blue-450 bg-blue-500/10 border-blue-500/20' },
    { label: 'Accommodation', value: budget.accommodation, icon: Hotel, color: 'text-indigo-450 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Food & Drinks', value: budget.food, icon: UtensilsCrossed, color: 'text-amber-450 bg-amber-500/10 border-amber-500/20' },
    { label: 'Activities', value: budget.activities, icon: Sparkles, color: 'text-purple-450 bg-purple-500/10 border-purple-500/20' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-indigo-400" />
        Estimated Budget Breakdown
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/40 border border-slate-850">
              <div className={`p-2.5 rounded-lg border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">{item.label}</span>
                <span className="text-base font-bold text-slate-100">${item.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/25">
        <div>
          <span className="text-sm text-slate-200 font-semibold block">Total Estimated Cost</span>
          <span className="text-xs text-slate-400">Based on standard averages & AI estimates</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            ${budget.total} USD
          </span>
        </div>
      </div>
    </div>
  );
}
