import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleInitialize = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/auth/init-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Initialization failed');
      }

      if (data.credentials) {
        setCredentials(data.credentials);
        toast.success('Admin account created successfully!');
      } else {
        toast.info(data.message || 'Admin already exists');
      }
    } catch (error: any) {
      console.error('Initialization error:', error);
      toast.error(error.message || 'Initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-2xl text-gray-900">
            <span className="text-3xl mr-2">🖼️</span>
            FrameShop
          </Link>
          <h1 className="mt-6 text-4xl text-gray-900">System Setup</h1>
          <p className="mt-2 text-gray-600">Initialize your FrameShop application</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!credentials ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-4">Create Default Admin Account</h2>
                <p className="text-gray-600 mb-4">
                  Click the button below to create a default admin account. This will set up:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                  <li>Admin user with full access to dashboard</li>
                  <li>Default credentials for immediate login</li>
                  <li>Sample products and categories (optional)</li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800">
                    <strong>Note:</strong> If an admin already exists, this will show you the status without creating a duplicate.
                  </p>
                </div>
              </div>

              <button
                onClick={handleInitialize}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Initializing...' : 'Initialize Admin Account'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Setup Complete!</h2>
                <p className="text-gray-600">Your admin account has been created successfully.</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-gray-900 mb-4">Admin Credentials</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-4 py-2">
                      <code className="text-gray-900">{credentials.email}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentials.email);
                          toast.success('Email copied!');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Password</label>
                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-4 py-2">
                      <code className="text-gray-900">{credentials.password}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentials.password);
                          toast.success('Password copied!');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Save these credentials securely. You can change the password after logging in.
                </p>
              </div>

              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 text-center transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <Link to="/" className="text-blue-600 hover:underline">
                Back to Home
              </Link>
              <Link to="/signup" className="text-blue-600 hover:underline">
                Create User Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
