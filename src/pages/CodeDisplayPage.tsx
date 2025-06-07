import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Copy, CheckCircle, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export function CodeDisplayPage() {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const accessCode = location.state?.accessCode;

  if (!accessCode) {
    navigate('/reg');
    return null;
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setIsCopied(true);
      showToast('Access code copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accessCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setIsCopied(true);
      showToast('Access code copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatAccessCode = (code: string) => {
    if (!isVisible) return '••••••••••••••••';
    return code.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Key className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Complete</h2>
            <p className="text-gray-600">Your anonymous access code has been generated</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  16-Digit Access Code
                </label>
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title={isVisible ? 'Hide code' : 'Show code'}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="font-mono text-2xl text-center text-gray-900 mb-4 tracking-wider bg-white rounded-lg py-4 px-3 border">
                {formatAccessCode(accessCode)}
              </div>

              <button
                onClick={handleCopyToClipboard}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Key className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Save this code securely - it cannot be recovered</li>
                      <li>Use this code to log in anonymously</li>
                      <li>Keep it private and don't share with others</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/auth"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}