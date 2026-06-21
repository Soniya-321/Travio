import React from 'react';
import { Hotel } from '../types';
import { Star, Building } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="flex flex-col p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:translate-y-[-2px] duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-base leading-tight">{hotel.name}</h4>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 uppercase tracking-wider border border-slate-700">
              {hotel.tier}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{hotel.rating}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col justify-between flex-1 gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Highlights</span>
          <p className="text-slate-355 text-sm mt-1 leading-relaxed">{hotel.highlights}</p>
        </div>

        <div className="flex items-baseline justify-between border-t border-slate-800/50 pt-3 mt-auto">
          <span className="text-xs text-slate-405">Estimated Cost</span>
          <div className="text-right">
            <span className="text-emerald-400 font-bold text-lg">${hotel.estimatedCostNightUSD}</span>
            <span className="text-slate-400 text-xs"> / night</span>
          </div>
        </div>
      </div>
    </div>
  );
}
