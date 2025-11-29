import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  CheckCircle,
  Download,
  Package,
  Clock,
} from "lucide-react";
import { projectId } from "../utils/supabase/info";
import { AuthContext } from "../App";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { accessToken } = React.useContext(AuthContext);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/orders`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      const foundOrder = data.orders.find((o: any) => o.id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error("Fetch order error:", error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 📄 Generate PDF Invoice
  // -------------------------------
  const handleDownloadInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");

    doc.setFontSize(22);
    doc.text("Decorizz Invoice", 14, 20);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Order ID: ${order.id}`, 14, 35);
    doc.text(`Payment Status: ${order.paymentStatus}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 49);

    // Shipping Address
    doc.setFont("Helvetica", "bold");
    doc.text("Shipping Address:", 14, 65);
    doc.setFont("Helvetica", "normal");

    doc.text(
      `${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
      14,
      72
    );

    // Table
    const items = order.items.map((item: any) => [
      item.productName,
      item.size,
      item.color,
      item.quantity,
      `₹${item.price}`,
      `₹${item.price * item.quantity}`,
    ]);

    autoTable(doc, {
      startY: 115,
      head: [["Product", "Size", "Color", "Qty", "Price", "Total"]],
      body: items,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ₹${order.subtotal}`, 14, finalY);
    doc.text(`Shipping: ₹${order.shipping}`, 14, finalY + 7);
    doc.text(`Grand Total: ₹${order.total}`, 14, finalY + 14);

    doc.save(`invoice-${order.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: "#14b8a6" }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Order not found</h1>
          <Link to="/" className="text-teal-600 hover:underline">
            Return to homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Decorative Squares */}
      <div className="flex justify-between max-w-5xl mx-auto px-4 pt-10">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded border-2 border-gray-200"></div>
          <div className="w-10 h-10 rounded border-2 border-gray-200"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded border-2 border-gray-200"></div>
          <div className="w-10 h-10 rounded border-2 border-gray-200"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-10">
          <CheckCircle
            className="w-20 h-20 mx-auto mb-4"
            style={{ color: "#14b8a6" }}
          />
          <h1 className="text-4xl text-gray-900 font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase 💚
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="text-2xl font-semibold text-gray-900">{order.id}</p>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow transition"
              style={{ backgroundColor: "#14b8a6" }}
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Shipping Address</p>
                <p className="text-gray-600">
                  {order.shippingAddress.fullName} <br />
                  {order.shippingAddress.address} <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">
                  Estimated Delivery
                </p>
                <p className="text-gray-600">5–7 business days</p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Payment Status</p>
                <p className="text-gray-600 capitalize">
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {item.productName}
                    </p>
                    <p className="text-gray-500">
                      {item.color} • {item.size} • Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-gray-900 font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : `₹${order.shipping}`}
                </span>
              </div>

              <div className="flex justify-between text-xl font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4">
          <Link
            to="/account"
            className="flex-1 py-3 rounded-xl text-white text-center shadow transition"
            style={{ backgroundColor: "#14b8a6" }}
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="flex-1 py-3 rounded-xl border text-center border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
