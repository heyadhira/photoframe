import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { User, Package, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function UserAccountPage() {
  const { user, accessToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchWishlist();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/orders`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/wishlist`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      const ids: string[] = data.wishlist?.items || [];
      setWishlist(ids);
      const details = await Promise.all(ids.map(async (id) => {
        try {
          const r = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products/${id}`,
            { headers: { Authorization: `Bearer ${publicAnonKey}` } }
          );
          const d = await r.json();
          return d.product ? d.product : null;
        } catch {
          return null;
        }
      }));
      setWishlistProducts(details.filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <Navigate to="/login" />;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen about-theme content-offset">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* TITLE */}
        <h1 className="section-title mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="card-soft rounded-2xl p-5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 rounded-xl mb-3 transition account-tab
                    ${activeTab === t.id ? 'text-white bg-teal' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                  style={{
                    backgroundColor: activeTab === t.id ? 'var(--primary)' : 'white',
                  }}
                >
                  {t.icon}
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="card-soft rounded-2xl p-8">
                <h2 className="section-title mb-6">Profile Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Role', value: user.role },
                  ].map((item, i) => (
                    <div key={i}>
                      <label className="block text-text-light mb-2 font-medium">
                        {item.label}
                      </label>
                      <input
                        value={item.value}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="card-soft rounded-2xl p-8">
                <h2 className="section-title mb-6">My Orders</h2>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="card-soft rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="order-item-title text-lg">
                              Order #{order.id}
                            </p>
                            <p className="order-item-meta mt-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="order-price text-lg">₹{order.total.toFixed(2)}</p>
                            <p className="order-status capitalize mt-1">
                              {order.status}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-gray-600 text-sm">
                              {item.productName} — {item.color} — {item.size} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No orders found.</p>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="card-soft rounded-2xl p-8">
                <h2 className="section-title mb-6">Wishlist</h2>

                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((p) => (
                      <a key={p.id} href={`/product/${p.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-1">{p.category || 'Frame'}</p>
                          <h3 className="text-gray-900 mb-1">{p.name}</h3>
                          <p className="text-gray-900 font-semibold">₹ {Number(p.price).toFixed(2)}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">
                    Your wishlist is empty.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
