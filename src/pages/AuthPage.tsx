import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { mockApi } from '../services/mockApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AuthPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isAccessCode = (value: string) => /^\d{16}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      if (isEmail(input)) {
        // Email login - this will trigger PIN flow
        try {
          await mockApi.login({ email: input });
        } catch (error) {
          if (error instanceof Error && error.message === 'PIN_REQUIRED') {
            navigate('/auth/email', { state: { email: input } });
            return;
          }
          throw error;
        }
      } else if (isAccessCode(input)) {
        // Access code login
        const response = await mockApi.login({ accessCode: input });
        login(response.user, response.accessToken);
        showToast('Successfully logged in!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Please enter a valid email address or 16-digit access code', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const response = await mockApi.googleLogin();
      login(response.user, response.accessToken);
      showToast('Successfully logged in with Google!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed';
      showToast(message, 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getInputIcon = () => {
    if (isEmail(input)) return <Mail className="h-5 w-5 text-gray-400" />;
    if (isAccessCode(input)) return <Key className="h-5 w-5 text-gray-400" />;
    return <Mail className="h-5 w-5 text-gray-400" />;
  };

  const getPlaceholder = () => {
    if (isEmail(input)) return 'Enter your email';
    if (isAccessCode(input)) return '16-digit access code';
    return 'Email or 16-digit access code';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                Email or Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getInputIcon()}
                </div>
                <input
                  id="input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              {input && (
                <p className="mt-2 text-xs text-gray-500">
                  {isEmail(input) && '✓ Email format detected - PIN will be sent'}
                  {isAccessCode(input) && '✓ 16-digit access code detected'}
                  {!isEmail(input) && !isAccessCode(input) && input.length > 0 && 
                    'Enter a valid email or 16-digit access code'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading || (!isEmail(input) && !isAccessCode(input))}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGoogleLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Chrome className="h-5 w-5 mr-2" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/reg" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}