import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'sonner';
import logo from "../assets/logo.png";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        {/* LOGO */}
        <div className="text-center mb-8">
          <Link to="/" className="flex flex-col items-center mb-3">
            <img src={logo} className="w-12 mb-2" alt="logo" />
            <span className="text-2xl font-semibold" style={{ color: '#14b8a6' }}>
              Decorizz
            </span>
          </Link>

          <h1 className="text-3xl font-semibold text-gray-900">
            Create your account
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">

          {/* FULL NAME */}
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={update}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>

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
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={update}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={update}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium transition"
            style={{
              backgroundColor: loading ? '#9ca3af' : '#14b8a6',
            }}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: '#14b8a6' }}
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
