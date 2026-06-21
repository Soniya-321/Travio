'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Map, CloudSun, DollarSign, ChevronRight, User } from 'lucide-react';
import TravioLogo from '../components/TravioLogo';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <TravioLogo variant="compact" />
          </Link>

          <nav className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-205 hover:bg-slate-800 hover:text-white transition-all"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-650 rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 lg:pt-32">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-550/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Introducing AI Itinerary Generation
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Craft Your Perfect Journey <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                Powered by Gemini AI
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
              Plan custom multi-day trips with smart day-by-day itineraries, verified budget planning,
              curated hotels, and a weather-aware packing assistant tailored specifically for your destination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] duration-300 cursor-pointer"
              >
                {isLoggedIn ? "Go to Dashboard" : "Start Planning Free"}
                <ChevronRight className="w-5 h-5" />
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-base font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 sm:py-24 bg-slate-900/30 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Everything you need to travel smart</h2>
              <p className="text-slate-400 text-sm sm:text-base">
                No more copy-pasting across tabs. Travio organizes your entire experience contextually.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group duration-300">
                <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/25 transition-all mb-5">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Gemini Itineraries</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tailored multi-day travel paths matching your budget tier, destination, and interests.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group duration-300">
                <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/25 transition-all mb-5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Budget Analysis</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Get structural breakdown insights on flights, hotels, food, and daily activities.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group duration-300">
                <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/25 transition-all mb-5">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Smart Packing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Weather-aware checklists matching destination forecasts and activity types contextually.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group duration-300">
                <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/25 transition-all mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Flexible Editing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Modify individual items inline or regenerate single days with specific focus feedback.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <TravioLogo variant="compact" className="opacity-50 scale-75 origin-left" />
          <span className="text-xs text-slate-600">Built with Next.js 14, Tailwind, Express & Gemini</span>
        </div>
      </footer>
    </div>
  );
}
