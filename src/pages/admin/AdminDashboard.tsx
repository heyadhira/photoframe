import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import { projectId } from "../../utils/supabase/info";

import {
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  const { accessToken } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingDeliveries: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/stats`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <Package className="w-7 h-7" />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `₹ ${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-7 h-7" />,
      bg: "bg-green-100 text-green-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-7 h-7" />,
      bg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <ShoppingBag className="w-7 h-7" />,
      bg: "bg-orange-100 text-orange-600",
    },
    {
      title: "Pending Deliveries",
      value: stats.pendingDeliveries,
      icon: <TrendingUp className="w-7 h-7" />,
      bg: "bg-red-100 text-red-600",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Products",
      path: "/admin/products",
      description: "Add, edit, delete",
    },
    {
      title: "Manage Orders",
      path: "/admin/orders",
      description: "Track & update orders",
    },
    {
      title: "Manage Users",
      path: "/admin/users",
      description: "Registered customers",
    },
    {
      title: "Manage Gallery",
      path: "/admin/gallery",
      description: "Upload & manage images",
    },
    {
      title: "Manage Testimonials",
      path: "/admin/testimonials",
      description: "Client reviews",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="ml-64 w-full p-10">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">
          Admin Dashboard
        </h1>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-b-2 border-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ============================ */}
            {/* STATS GRID */}
            {/* ============================ */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-14">
  {statCards.map((stat, i) => (
    <div
      key={i}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
    >
      <div
        className={`${stat.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}
      >
        {stat.icon}
      </div>

      <p className="text-gray-600 text-sm">{stat.title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
    </div>
  ))}
</div>

            {/* ============================ */}
            {/* QUICK ACTIONS */}
            {/* ============================ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="block p-6 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
