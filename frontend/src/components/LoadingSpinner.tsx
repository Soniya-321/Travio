import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center max-w-md text-center">
        {/* Animated Globe/Pulse Ring */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-2 bg-blue-500 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute inset-6 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
            {/* Travel SVG Icon */}
            <svg
              className="w-10 h-10 text-white animate-spin"
              style={{ animationDuration: '4s' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m0 0l-3-3m3 3l-3 3"
              />
            </svg>
          </div>
        </div>

        {/* Text and animations */}
        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-100">
          Crafting Your Adventure
        </h2>
        <p className="text-slate-400 text-sm animate-pulse">
          Our AI is crafting your perfect trip...
        </p>

        {/* Loading Progress Bar simulation */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-1/3 animate-[pulse_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>
    </div>
  );
}
