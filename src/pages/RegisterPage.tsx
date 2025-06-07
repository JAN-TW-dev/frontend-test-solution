import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, UserX } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { mockApi } from '../services/mockApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await mockApi.register({ email });
    } catch (error) {
      if (error instanceof Error && error.message === 'PIN_REQUIRED') {
        navigate('/auth/email', { state: { email } });
        return;
      }
      const message = error instanceof Error ? error.message : 'Registration failed';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousRegistration = async () => {
    setIsAnonymousLoading(true);

    try {
      const response = await mockApi.register({ isAnonymous: true });
      if ('accessCode' in response) {
        navigate('/reg/code', { state: { accessCode: response.accessCode } });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Anonymous registration failed';
      showToast(message, 'error');
    } finally {
      setIsAnonymousLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Choose your registration method</p>
          </div>

          {/* Email Registration */}
          <form onSubmit={handleEmailSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim() || !isValidEmail(email) || isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Register with Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Anonymous Registration */}
          <div className="space-y-4">
            <button
              onClick={handleAnonymousRegistration}
              disabled={isAnonymousLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnonymousLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserX className="h-5 w-5 mr-2" />
                  Anonymous Registration
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Get a 16-digit access code for anonymous access
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/auth" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}