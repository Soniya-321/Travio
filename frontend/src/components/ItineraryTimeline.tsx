import React, { useState } from 'react';
import { Trip, DayItinerary, Activity } from '../types';
import ActivityCard from './ActivityCard';
import { Plus, RefreshCw, Calendar } from 'lucide-react';
import RegenerateDayModal from './RegenerateDayModal';

interface ItineraryTimelineProps {
  trip: Trip;
  onUpdateItinerary: (updatedItinerary: DayItinerary[]) => Promise<void>;
  onRegenerateDay: (dayNumber: number, feedback: string) => Promise<void>;
}

export default function ItineraryTimeline({
  trip,
  onUpdateItinerary,
  onRegenerateDay,
}: ItineraryTimelineProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);

  // Form state for adding custom activity
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [newCost, setNewCost] = useState('0');
  const [isAdding, setIsAdding] = useState(false);

  const currentDay = trip.itinerary[activeDayIndex] || { dayNumber: activeDayIndex + 1, activities: [] };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newActivity: Activity = {
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom added activity.',
      timeOfDay: newTime,
      estimatedCostUSD: Number(newCost) || 0,
    };

    const updatedItinerary = [...trip.itinerary];

    // Find if day already exists in the itinerary
    const dayIdx = updatedItinerary.findIndex((d) => d.dayNumber === currentDay.dayNumber);
    if (dayIdx !== -1) {
      updatedItinerary[dayIdx] = {
        ...updatedItinerary[dayIdx],
        activities: [...updatedItinerary[dayIdx].activities, newActivity],
      };
    } else {
      updatedItinerary.push({
        dayNumber: currentDay.dayNumber,
        activities: [newActivity],
      });
      updatedItinerary.sort((a, b) => a.dayNumber - b.dayNumber);
    }

    try {
      await onUpdateItinerary(updatedItinerary);
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewTime('Morning');
      setNewCost('0');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteActivity = async (activityIndex: number) => {
    const updatedItinerary = [...trip.itinerary];
    const dayIdx = updatedItinerary.findIndex((d) => d.dayNumber === currentDay.dayNumber);

    if (dayIdx !== -1) {
      const updatedActivities = [...updatedItinerary[dayIdx].activities];
      updatedActivities.splice(activityIndex, 1);

      updatedItinerary[dayIdx] = {
        ...updatedItinerary[dayIdx],
        activities: updatedActivities,
      };

      try {
        await onUpdateItinerary(updatedItinerary);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {trip.itinerary.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => {
              setActiveDayIndex(idx);
              setIsAdding(false);
            }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border flex items-center gap-2 ${
              activeDayIndex === idx
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Day Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">Day {currentDay.dayNumber} Itinerary</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage activities for Day {currentDay.dayNumber} in {trip.destination}.
          </p>
        </div>

        <button
          onClick={() => setIsRegenModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Day {currentDay.dayNumber}
        </button>
      </div>

      {/* Activities Timeline */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 ml-2.5">
        {currentDay.activities.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No activities scheduled for this day yet. Add one below!
          </div>
        ) : (
          currentDay.activities.map((activity, idx) => (
            <div key={idx} className="relative">
              {/* Bullet point on timeline */}
              <div className="absolute -left-[33px] top-5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 shadow-md"></div>
              <ActivityCard
                activity={activity}
                onDelete={() => handleDeleteActivity(idx)}
              />
            </div>
          ))
        )}

        {/* Add Activity Button or Form */}
        <div className="relative">
          <div className="absolute -left-[33px] top-3.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-800 shadow-md"></div>

          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 w-full p-4 rounded-2xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60 text-slate-405 hover:text-slate-300 font-semibold text-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add custom activity to Day {currentDay.dayNumber}
            </button>
          ) : (
            <form onSubmit={handleAddActivity} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">Add Custom Activity</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">Activity Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Visit Meiji Shrine"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">Time of Day</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value as 'Morning' | 'Afternoon' | 'Evening')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">Estimated Cost (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      min="0"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">Short Description</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Historic Shinto shrine with massive wooden gates."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Regenerate Day Modal */}
      <RegenerateDayModal
        isOpen={isRegenModalOpen}
        dayNumber={currentDay.dayNumber}
        destination={trip.destination}
        onClose={() => setIsRegenModalOpen(false)}
        onRegenerate={(feedback) => onRegenerateDay(currentDay.dayNumber, feedback)}
      />
    </div>
  );
}
