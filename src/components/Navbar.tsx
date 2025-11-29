import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../App';
import logo from "../assets/logo.png";


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" style={{ borderBottom: '1px solid #e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div
                // className="w-10 h-10 rounded flex items-center justify-center"
                // style={{
                //   backgroundColor: '#14b8a6',
                //   color: 'white'
                // }}
              >
                <img 
                  src={logo} 
                  alt="Logo"
                  className="w-10 h-10 object-contain" 
                />
              </div>

            <span 
              className="text-xl" 
              style={{ 
                fontWeight: 700,
                color: '#1f2937'
              }}
            >
              DECORIZE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 transition"
              style={{ fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 transition"
              style={{ fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Frames
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 transition"
              style={{ fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              About
            </Link>
            <Link 
              to="/gallery" 
              className="text-gray-700 transition"
              style={{ fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Gallery
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none"
                style={{ 
                  borderColor: '#d1d5db',
                  width: '240px',
                  fontSize: '14px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 text-gray-500 transition"
                style={{ transform: 'translateY(-50%)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="text-gray-700 relative transition"
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* User/Login */}
            {user ? (
              <div className="relative group">
                <button 
                  className="text-gray-700 flex items-center space-x-2 transition"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline" style={{ fontWeight: 500 }}>
                    {user.name}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block"
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 transition"
                    style={{ fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#14b8a6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    My Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 transition"
                      style={{ fontWeight: 500 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#14b8a6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 transition"
                    style={{ fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#14b8a6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-md transition"
                style={{ 
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden py-4 space-y-3"
            style={{ borderTop: '1px solid #e5e7eb' }}
          >
            <Link
              to="/"
              className="block text-gray-700 py-2 transition"
              style={{ fontWeight: 500 }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block text-gray-700 py-2 transition"
              style={{ fontWeight: 500 }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Frames
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 py-2 transition"
              style={{ fontWeight: 500 }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              About
            </Link>
            <Link
              to="/gallery"
              className="block text-gray-700 py-2 transition"
              style={{ fontWeight: 500 }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              Gallery
            </Link>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="pt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search frames..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none"
                  style={{ 
                    borderColor: '#d1d5db',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 text-gray-500"
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}