import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const update = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login Successful!');
      navigate('/');
    } catch (err: any) {
      toast.error('Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        {/* LOGO + BRAND */}
        <div className="text-center mb-8">
          <Link to="/" className="flex flex-col items-center mb-3">
            <img src={logo} className="w-20 mb-2" alt="logo" />
          
          </Link>

          <h1 className="text-3xl font-semibold text-gray-900">
            Sign in to your account
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">
          
          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={update}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm font-medium" style={{ color: '#14b8a6' }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={update}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium transition"
            style={{
              backgroundColor: loading ? '#9ca3af' : '#14b8a6',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="font-medium hover:underline"
              style={{ color: '#14b8a6' }}
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
