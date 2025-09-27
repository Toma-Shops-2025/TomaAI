import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
    
    if (id) {
      // Here you would typically verify the payment with your backend
      console.log('Payment successful! Session ID:', id);
      
      // Redirect to main app after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your images have been added to your account.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-400 mb-4">
            Session ID: {sessionId}
          </p>
        )}
        <p className="text-sm text-gray-400">
          Redirecting you back to the app...
        </p>
      </div>
    </div>
  );
}
