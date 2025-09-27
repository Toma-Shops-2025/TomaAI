import React from 'react';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-yellow-500 text-6xl mb-4">⚠</div>
        <h1 className="text-2xl font-bold text-white mb-4">Payment Cancelled</h1>
        <p className="text-gray-300 mb-6">
          Your payment was cancelled. No charges have been made.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Return to App
        </button>
      </div>
    </div>
  );
}
