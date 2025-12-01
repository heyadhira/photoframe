import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../App';
import { cartEvents } from '../utils/cartEvents';
import logo from "../assets/logo-r.png";


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showDecorDropdown, setShowDecorDropdown] = useState(false);
  const [showMobileDecorDropdown, setShowMobileDecorDropdown] = useState(false);
  const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState(false);
  const { user, logout, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && accessToken) {
      fetchCartCount();
      const unsubscribe = cartEvents.subscribe(() => {
        fetchCartCount();
      });
      return unsubscribe;
    }
  }, [user, accessToken]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch(
        `https://wievhaxedotrhktkjupg.supabase.co/functions/v1/make-server-52d68140/cart`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      const count = data.cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Cart count error:', error);
    }
  };

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
            
            {/* Decor by Room Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDecorDropdown(true)}
              onMouseLeave={() => setShowDecorDropdown(false)}
            >
              <button
                className="text-gray-700 transition flex items-center gap-1 hover:text-teal-600"
                style={{ fontWeight: 500 }}
              >
                Decor by Room
                <svg className={`w-4 h-4 transition-transform ${showDecorDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Horizontal Dropdown Menu */}
              {showDecorDropdown && (
              <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 animate-fadeIn z-50">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/decor-by-room"
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
                    >
                      All Rooms
                    </Link>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <Link to="/decor-by-room?room=Living Area" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Living Area
                    </Link>
                    <Link to="/decor-by-room?room=Bedroom" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Bedroom
                    </Link>
                    <Link to="/decor-by-room?room=Kitchen" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Kitchen
                    </Link>
                    <Link to="/decor-by-room?room=Dining Area" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Dining
                    </Link>
                    <Link to="/decor-by-room?room=Office / Study Zone" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Office
                    </Link>
                    <Link to="/decor-by-room?room=Kids Space" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Kids
                    </Link>
                    <Link to="/decor-by-room?room=Bath Space" className="px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all font-medium whitespace-nowrap text-sm">
                      Bath
                    </Link>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative" style={{ zIndex: 50 }}>
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
          <div className="flex items-center space-x-4 relative" style={{ zIndex: 50 }}>

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="text-gray-700 relative transition bg-[#14b8a6] p-2 rounded-md"
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 min-w-[1.25rem] h-5 px-1.5  from-red-500 to-red-600 text-balck text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white z-10  bg-[#ff3d00]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User/Login - Desktop Only */}
            {user ? (
              <div className="relative group hidden md:flex">
                <button
                  className="inline-flex items-center gap-2  p-2 rounded-md text-black transition"
                  
                >
                  <User className="w-5 h-5" />
                  <span style={{ fontWeight: 500 }}>
                    {user.name}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div
                  className="absolute right-50px top-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block"
                  style={{ border: '1px solid #e5e7eb', zIndex: 60 }}
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
                aria-label="Login"
                title="Login"
                className="hidden md:flex items-center justify-center bg-[#14b8a6] p-2 rounded-md transition"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                <User className="w-5 h-5 text-white" />
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

            {/* Decor by Room - Mobile Collapsible */}
            <div className="py-2">
              <button
                onClick={() => setShowMobileDecorDropdown(!showMobileDecorDropdown)}
                className="w-full flex items-center justify-between text-gray-700 font-semibold transition hover:text-teal-600"
              >
                <span>Decor by Room</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showMobileDecorDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMobileDecorDropdown && (
              <div className="pl-4 space-y-2 mt-2">
                <Link
                  to="/decor-by-room"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Rooms
                </Link>
                <Link
                  to="/decor-by-room?room=Living Area"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Living Area
                </Link>
                <Link
                  to="/decor-by-room?room=Bedroom"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bedroom
                </Link>
                <Link
                  to="/decor-by-room?room=Kitchen"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kitchen
                </Link>
                <Link
                  to="/decor-by-room?room=Dining Area"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dining Area
                </Link>
                <Link
                  to="/decor-by-room?room=Office / Study Zone"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Office / Study Zone
                </Link>
                <Link
                  to="/decor-by-room?room=Kids Space"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kids Space
                </Link>
                <Link
                  to="/decor-by-room?room=Bath Space"
                  className="block text-gray-600 py-1 text-sm transition hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bath Space
                </Link>
              </div>
              )}
            </div>

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

            {/* Profile Section - Mobile Collapsible */}
            {user ? (
              <div className="py-2 border-t border-gray-200 mt-2 pt-4">
                <button
                  onClick={() => setShowMobileProfileDropdown(!showMobileProfileDropdown)}
                  className="w-full flex items-center justify-between text-gray-700 font-semibold transition hover:text-teal-600"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${showMobileProfileDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMobileProfileDropdown && (
                <div className="pl-4 space-y-2 mt-2">
                  <Link
                    to="/account"
                    className="block text-gray-600 py-2 text-sm transition hover:text-teal-600"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowMobileProfileDropdown(false);
                    }}
                  >
                    My Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block text-gray-600 py-2 text-sm transition hover:text-teal-600"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowMobileProfileDropdown(false);
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      setShowMobileProfileDropdown(false);
                    }}
                    className="block w-full text-left text-red-600 py-2 text-sm transition hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-gray-700 py-2 transition border-t border-gray-200 mt-2 pt-4"
                style={{ fontWeight: 500 }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Login
              </Link>
            )}

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
