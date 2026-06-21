'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f172a', // bg-slate-900
          color: '#f8fafc', // text-slate-50
          border: '1px solid #1e293b', // border-slate-800
        },
      }}
    />
  );
}
