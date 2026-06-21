'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../utils/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { ArrowLeft, Send, MapPin, Calendar, DollarSign, Heart } from 'lucide-react';
import TravioLogo from '../../../components/TravioLogo';

export default function NewTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState('5');
  const [budgetTier, setBudgetTier] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Router protection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const interestOptions = [
    'Food',
    'Culture',
    'Adventure',
    'Shopping',
    'Nature',
    'Nightlife',
    'History',
    'Wellness',
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    const days = Number(durationDays);
    if (isNaN(days) || days < 1 || days > 30) {
      toast.error('Duration must be between 1 and 30 days');
      return;
    }

    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      await api.post('/trips/generate', {
        destination: destination.trim(),
        durationDays: days,
        budgetTier,
        interests: selectedInterests,
      });

      toast.success('Your dream trip has been generated!');
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      const errorWithResponse = err as { response?: { data?: { message?: string } } };
      const message = errorWithResponse.response?.data?.message || 'Failed to generate itinerary. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {loading && <LoadingSpinner />}

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <TravioLogo variant="compact" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full z-10 relative">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-550/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-6 relative">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Plan an Adventure</h2>
            <p className="text-slate-400 text-xs">
              Fill in your preferences, and our Gemini AI will generate a personalized itinerary.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Where do you want to go?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-550">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo, Paris, Maui"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-105 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Duration (Days)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-555">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    max="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-105 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Budget Tier */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Budget Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-555">
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value as 'Low' | 'Medium' | 'High')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-955 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  >
                    <option value="Low">Low (Backpacker/Budget)</option>
                    <option value="Medium">Medium (Mid-range/Comfort)</option>
                    <option value="High">High (Luxury/Splurge)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Your Interests
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interestOptions.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-indigo-500 text-indigo-400' : ''}`} />
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 px-6 py-4 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-xl shadow-indigo-550/20 transition-all hover:scale-[1.01] duration-300 cursor-pointer"
              >
                Generate Trip with AI
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
