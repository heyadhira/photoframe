import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { AuthContext } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);
  
  const [cart, setCart] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'razorpay',
    couponCode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const cartRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/cart`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const cartData = await cartRes.json();
      setCart(cartData.cart);

      const productsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total: number, item: any) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData: any, totalAmount: number) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return false;
    }

    const options = {
      key: 'rzp_test_RbFD9b67kdd1Br', // Razorpay Key ID
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'Decorizz',
      description: 'Photo Frame Purchase',
      image: '/logo.png',
      handler: async function (response: any) {
        // Payment successful
        console.log('Payment successful:', response);
        
        // Create order with payment details
        const finalOrderData = {
          ...orderData,
          paymentStatus: 'paid',
          paymentId: response.razorpay_payment_id,
          paymentSignature: response.razorpay_signature,
        };
        
        const orderResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(finalOrderData),
          }
        );

        if (orderResponse.ok) {
          const data = await orderResponse.json();
          toast.success('Order placed successfully!');
          navigate(`/order-success/${data.order.id}`);
        } else {
          toast.error('Failed to create order');
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        // 🔹 match site teal theme
        color: '#14b8a6',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProcessing(true);

    try {
      const subtotal = getCartTotal();
      const shipping = subtotal > 50 ? 0 : 5;
      const total = subtotal + shipping;

      const orderData = {
        items: cart.items.map((item: any) => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product?.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: product?.price,
          };
        }),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        shipping,
        total,
      };

      // Handle different payment methods
      if (formData.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderData, total);
      } else if (formData.paymentMethod === 'cod') {
        // COD - create order directly
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ ...orderData, paymentStatus: 'pending' }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          toast.success('Order placed successfully!');
          navigate(`/order-success/${data.order.id}`);
        } else {
          toast.error('Failed to place order');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: '#14b8a6' }}
          ></div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Decorative squares like HomePage */}
      <div className="flex justify-between max-w-7xl mx-auto px-4 pt-10">
        <div className="flex gap-2">
          <div
            className="w-10 h-10 rounded border-2"
            style={{ borderColor: '#cbd5e1' }}
          ></div>
          <div
            className="w-10 h-10 rounded border-2"
            style={{ borderColor: '#cbd5e1' }}
          ></div>
        </div>
        <div className="flex gap-2">
          <div
            className="w-10 h-10 rounded border-2"
            style={{ borderColor: '#cbd5e1' }}
          ></div>
          <div
            className="w-10 h-10 rounded border-2"
            style={{ borderColor: '#cbd5e1' }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading with teal accent like HomePage */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
          Secure <span style={{ color: '#14b8a6' }}>Checkout</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div
                className="bg-white rounded-xl p-6 shadow-md border"
                style={{ borderColor: '#e5e7eb' }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div
                className="bg-white rounded-xl p-6 shadow-md border"
                style={{ borderColor: '#e5e7eb' }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{ borderColor: '#cbd5e1' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-900">
                      Razorpay (Card/UPI/Netbanking)
                    </span>
                  </label>
                  
                  
                  
                  <label
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{ borderColor: '#cbd5e1' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <Wallet className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="text-gray-900">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Coupon Code */}
              <div
                className="bg-white rounded-xl p-6 shadow-md border"
                style={{ borderColor: '#e5e7eb' }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Coupon Code
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#cbd5e1' }}
                  />
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg shadow-md transition"
                    style={{ 
                      backgroundColor: '#14b8a6',
                      color: 'white',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d9488')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#14b8a6')}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-xl p-6 shadow-md border sticky top-24"
                style={{ borderColor: '#e5e7eb' }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  {cart?.items?.map((item: any) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    
                    return (
                      <div
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {product.name} x{item.quantity}
                        </span>
                        <span>${(product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-3" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex justify-between text-xl font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 rounded-xl shadow-lg transition disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: processing ? '#9ca3af' : '#14b8a6',
                    color: 'white',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    if (!processing) e.currentTarget.style.backgroundColor = '#0d9488';
                  }}
                  onMouseLeave={(e) => {
                    if (!processing) e.currentTarget.style.backgroundColor = '#14b8a6';
                  }}
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
