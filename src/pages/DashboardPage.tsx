import { useAuth } from '../contexts/AuthContext';
import { User, Key, Mail, Calendar, Shield } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your account dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-600">Your account details</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Account Type</span>
              <span className="text-sm text-gray-900">
                {user.isAnonymous ? 'Anonymous' : 'Email Account'}
              </span>
            </div>
            
            {!user.isAnonymous && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <span className="text-sm text-gray-900">{user.email}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">User ID</span>
              <span className="text-sm text-gray-900 font-mono">{user.id}</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-600">Created</span>
              <span className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Authentication Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Authentication Status</h3>
              <p className="text-sm text-gray-600">Your current session</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center py-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Successfully authenticated</span>
            </div>
            
            <div className="flex items-center py-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Session active</span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-green-800">
                {user.isAnonymous 
                  ? 'You are logged in anonymously with your access code.'
                  : 'You are logged in with your email account.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Features</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Mail className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Email Authentication</h4>
              <p className="text-sm text-gray-600">PIN-based verification</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <Key className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Access Codes</h4>
              <p className="text-sm text-gray-600">16-digit anonymous login</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Session Management</h4>
              <p className="text-sm text-gray-600">Persistent authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}