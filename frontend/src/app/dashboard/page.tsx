'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';
import { Trip, DayItinerary } from '../../types';
import TripCard from '../../components/TripCard';
import ItineraryTimeline from '../../components/ItineraryTimeline';
import HotelCard from '../../components/HotelCard';
import BudgetBreakdown from '../../components/BudgetBreakdown';
import PackingList from '../../components/PackingList';
import { toast } from 'react-hot-toast';
import TravioLogo from '../../components/TravioLogo';
import {
  Compass,
  Plus,
  LogOut,
  Loader,
  Briefcase,
  MapPin,
  DollarSign,
  Backpack,
  Hotel,
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'budget' | 'packing'>('itinerary');

  // Verify auth state and fetch trips on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
      } catch (e) {
        console.error(e);
      }
    }

    fetchTrips();
  }, [router]);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
      if (response.data.length > 0) {
        setSelectedTrip(response.data[0]);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/trips/${tripId}`);
      toast.success('Trip deleted successfully');

      const updatedTrips = trips.filter((t) => t._id !== tripId);
      setTrips(updatedTrips);

      if (selectedTrip?._id === tripId) {
        setSelectedTrip(updatedTrips.length > 0 ? updatedTrips[0] : null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete trip');
    }
  };

  const handleUpdateItinerary = async (updatedItinerary: DayItinerary[]) => {
    if (!selectedTrip) return;

    try {
      const response = await api.put(`/trips/${selectedTrip._id}`, {
        itinerary: updatedItinerary,
      });
      const updatedTrip = response.data;

      setSelectedTrip(updatedTrip);
      setTrips(trips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
      toast.success('Itinerary updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update itinerary');
      throw err;
    }
  };

  const handleRegenerateDay = async (dayNumber: number, feedback: string) => {
    if (!selectedTrip) return;

    try {
      const response = await api.post(`/trips/${selectedTrip._id}/regenerate-day`, {
        dayNumber,
        userFeedback: feedback,
      });
      const updatedTrip = response.data;

      setSelectedTrip(updatedTrip);
      setTrips(trips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
      toast.success(`Day ${dayNumber} regenerated successfully`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to regenerate day');
      throw err;
    }
  };

  const handleTogglePackingItem = async (index: number) => {
    if (!selectedTrip) return;

    const updatedPackingList = selectedTrip.packingList.map((item, idx) =>
      idx === index ? { ...item, isPacked: !item.isPacked } : item
    );

    // Optimistic UI updates
    const prevTrip = { ...selectedTrip };
    setSelectedTrip({
      ...selectedTrip,
      packingList: updatedPackingList,
    });

    try {
      const response = await api.put(`/trips/${selectedTrip._id}`, {
        packingList: updatedPackingList,
      });
      const updatedTrip = response.data;
      setSelectedTrip(updatedTrip);
      setTrips(trips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update packing checklist');
      // Rollback local state
      setSelectedTrip(prevTrip);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
          <span className="text-slate-400 font-semibold">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-955/65 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <TravioLogo variant="compact" />
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-semibold">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {trips.length === 0 ? (
          /* Empty State UI */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
              <Compass className="w-12 h-12 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">No Trips Planned Yet</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create a customized, AI-driven multi-day itinerary complete with hotel choices,
                budgets, and smart weather-aware checklists.
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="flex items-center gap-2 px-6 py-3.5 font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/10 hover:scale-[1.02] duration-300 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          /* Dashboard Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar (Trip List) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Your Trips
                </h2>
                <Link
                  href="/dashboard/new"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-650 hover:to-blue-600 rounded-xl transition-all shadow shadow-indigo-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Trip
                </Link>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    isActive={selectedTrip?._id === trip._id}
                    onSelect={() => setSelectedTrip(trip)}
                    onDelete={() => handleDeleteTrip(trip._id)}
                  />
                ))}
              </div>
            </div>

            {/* Viewer Pane */}
            <div className="lg:col-span-8">
              {selectedTrip ? (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Destination</span>
                      </div>
                      <h2 className="text-2xl font-black text-white mt-1">{selectedTrip.destination}</h2>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-800 text-slate-350">
                          {selectedTrip.durationDays} Days
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-800 text-slate-350">
                          {selectedTrip.budgetTier} Budget
                        </span>
                        {selectedTrip.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-900/30"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation tabs */}
                  <div className="flex border-b border-slate-800/80 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('itinerary')}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'itinerary'
                          ? 'border-indigo-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      Itinerary
                    </button>
                    <button
                      onClick={() => setActiveTab('hotels')}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'hotels'
                          ? 'border-indigo-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Hotel className="w-4 h-4" />
                      Hotels
                    </button>
                    <button
                      onClick={() => setActiveTab('budget')}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'budget'
                          ? 'border-indigo-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Budget
                    </button>
                    <button
                      onClick={() => setActiveTab('packing')}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'packing'
                          ? 'border-indigo-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Backpack className="w-4 h-4" />
                      Packing Assistant
                    </button>
                  </div>

                  {/* Tab Display Area */}
                  <div className="pt-2">
                    {activeTab === 'itinerary' && (
                      <ItineraryTimeline
                        trip={selectedTrip}
                        onUpdateItinerary={handleUpdateItinerary}
                        onRegenerateDay={handleRegenerateDay}
                      />
                    )}

                    {activeTab === 'hotels' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                          <Hotel className="w-5 h-5 text-indigo-400" />
                          Recommended Accommodations
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {selectedTrip.hotels.map((hotel, index) => (
                            <HotelCard key={index} hotel={hotel} />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'budget' && (
                      <BudgetBreakdown budget={selectedTrip.estimatedBudget} />
                    )}

                    {activeTab === 'packing' && (
                      <PackingList
                        items={selectedTrip.packingList}
                        onToggleItem={handleTogglePackingItem}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-10 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                  Select a trip from the list to view its itinerary.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
