import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { mockApi } from '../services/mockApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function EmailAuthPage() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/auth');
      return;
    }

    // Start 60-second countdown
    setCountdown(60);
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      showToast('Please enter a 6-digit PIN', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await mockApi.verifyPin({ email, pin });
      login(response.user, response.accessToken);
      showToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PIN verification failed';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendPin = async () => {
    setIsResending(true);

    try {
      await mockApi.resendPin(email);
      showToast('PIN resent successfully!', 'success');
      setCountdown(60);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend PIN';
      showToast(message, 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a 6-digit PIN to
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Enter PIN Code
              </label>
              <input
                id="pin"
                type="text"
                value={pin}
                onChange={handlePinChange}
                placeholder="123456"
                maxLength={6}
                className="block w-full px-3 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors tracking-widest"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                For testing, use PIN: 123456
              </p>
            </div>

            <button
              type="submit"
              disabled={pin.length !== 6 || isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Verify PIN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResendPin}
              disabled={countdown > 0 || isResending}
              className="flex items-center justify-center mx-auto px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend PIN'}
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/auth" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}