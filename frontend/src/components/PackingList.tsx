import React from 'react';
import { PackingItem } from '../types';
import { FileText, Shirt, Backpack, Heart, Square, CheckSquare } from 'lucide-react';

interface PackingListProps {
  items: PackingItem[];
  onToggleItem: (originalIndex: number) => void;
}

export default function PackingList({ items, onToggleItem }: PackingListProps) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.isPacked).length;
  const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const categories = [
    { name: 'Documents', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Clothing', icon: Shirt, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Gear', icon: Backpack, color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Toiletries & Health', icon: Heart, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Backpack className="w-5 h-5 text-indigo-400" />
            AI Weather-Aware Packing Assistant
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Contextual, weather-appropriate items recommended by our AI for this destination.
          </p>
        </div>

        {/* Progress bar and counter */}
        <div className="flex flex-col sm:items-end gap-1.5 min-w-[150px]">
          <div className="flex items-center justify-between w-full text-xs font-semibold text-slate-300">
            <span>{packedItems} / {totalItems} items packed</span>
            <span>{packedPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${packedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const filteredItems = items.filter((item) => item.category === cat.name);

          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.name} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
              <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-800/80">
                <div className={`p-1.5 rounded-lg ${cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-205">{cat.name}</h4>
              </div>

              <div className="space-y-1">
                {filteredItems.map((item) => {
                  // Find original index to ensure we toggle correctly in parent list
                  const originalIndex = items.findIndex((i) => i.item === item.item);
                  return (
                    <button
                      key={item.item}
                      onClick={() => onToggleItem(originalIndex)}
                      className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-900/60 transition-colors text-left select-none group"
                    >
                      <div className="mt-0.5 text-slate-500 group-hover:text-indigo-400 transition-colors">
                        {item.isPacked ? (
                          <CheckSquare className="w-4.5 h-4.5 text-emerald-400 fill-emerald-500/10" />
                        ) : (
                          <Square className="w-4.5 h-4.5" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-all duration-305 ${
                          item.isPacked ? 'text-slate-500 line-through' : 'text-slate-350'
                        }`}
                      >
                        {item.item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
