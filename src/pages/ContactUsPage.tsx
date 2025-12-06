import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MapPin, Phone, Mail, Search as SearchIcon, Send } from "lucide-react";
import TiltCard from "../components/TiltCard";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [instaPosts, setInstaPosts] = useState<{ id: string; embedUrl: string }[]>([]);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    try {
      setSubmitting(true);
      const resp = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/contact-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await resp.json();
      if (!resp.ok) toast.error(data.error || "Failed to send message");
      else {
        toast.success("Message sent successfully");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-52d68140/instagram`);
        const data = await res.json();
        setInstaPosts((data.items || []).slice(0, 6));
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen about-theme content-offset">
      <Navbar />

      {/* Heading */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-rashi text-5xl sm:text-6xl font-extrabold tracking-tight animate-title">
          <span>Contact</span>{" "}
          <span style={{ color: "#14b8a6" }}>Us</span>
        </h1>
        <p className="text-gray-600 mt-3">
          Get in touch with us for any enquiries and questions
        </p>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT FORM — PREMIUM 3D CARD */}
          <TiltCard className="lg:col-span-2 soft-card p-8 card-appear">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Send us a message
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                    placeholder="+91 9258784544"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                  placeholder="Write your message here"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="premium-btn px-6 py-3 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: "#14b8a6" }}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="reset"
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  onClick={() =>
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    })
                  }
                >
                  Clear
                </button>
              </div>

            </form>
          </TiltCard>

          {/* RIGHT SIDE CARDS */}
          <div className="space-y-6">

  {/* PHONE */}
  <TiltCard className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 card-appear">
    <div className="flex items-start gap-5">

      {/* Icon circle */}
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6]/10 to-[#3b2f27]/10 flex items-center justify-center shadow-inner">
        <Phone className="w-6 h-6 text-[#14b8a6]" />
      </div>

      {/* Text */}
      <div>
        <p className="text-lg font-semibold text-gray-900">Phone Number</p>
        <p className="text-gray-600 text-sm mt-1">+91 9705180483</p>
      </div>

    </div>
  </TiltCard>

  {/* EMAIL */}
  <TiltCard className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 card-appear">
    <div className="flex items-start gap-5">

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6]/10 to-[#3b2f27]/10 flex items-center justify-center shadow-inner">
        <Mail className="w-6 h-6 text-[#14b8a6]" />
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-900">Email Address</p>
        <p className="text-gray-600 text-sm mt-1">Contact@decorizz.com</p>
      </div>

    </div>
  </TiltCard>

  {/* LOCATION */}
  <TiltCard className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 card-appear">
    <div className="flex items-start gap-5">

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6]/10 to-[#3b2f27]/10 flex items-center justify-center shadow-inner">
        <MapPin className="w-6 h-6 text-[#14b8a6]" />
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-900">Location</p>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          Gurugram Road, Near Subhash Chowk, Shaktifarm Market,<br />
          Sitarganj, Udham Singh Nagar, 253151.
        </p>
      </div>

    </div>
  </TiltCard>

</div>


        </div>
      </section>

      {/* Instagram Section */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10">
        <div className="text-center mb-8">
          <h2 className="font-rashi text-4xl font-extrabold text-[#3b2f27]">
            Follow Us on <span className="text-[#14b8a6]">Instagram</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Explore our latest frames, studio work, and customer stories
          </p>
        </div>

        {instaPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instaPosts.map(p => (
              <div key={p.id} className="soft-card p-4 rounded-3xl shadow-xl border border-gray-200 card-appear">
                <iframe
                  src={p.embedUrl}
                  width="100%"
                  height="520"
                  className="w-full rounded-2xl"
                  style={{ border: '0', overflow: 'hidden' }}
                  scrolling="no"
                  allowTransparency={true}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div className="soft-card p-4 rounded-3xl shadow-xl border border-gray-200 card-appear">
            <p className="text-center text-gray-600">No posts configured yet.</p>
          </div>
        )}

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/decorizzdotcom/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full shadow-lg font-semibold text-white"
            style={{ backgroundColor: '#14b8a6' }}
          >
            Follow @decorizzdotcom
          </a>
        </div>
      </section> */}

      {/* MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h3 className="section-title text-center">Find Us</h3>
        <p className="text-sm text-gray-600 text-center mt-2">
          Click the map to get directions instantly
        </p>

        <div className="relative mt-8 rounded-3xl overflow-hidden soft-card shadow-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.704724910472!2d79.700000!3d28.930000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSitarganj!5e0!3m2!1sen!2sin!4v1706800000000"
            width="100%"
            height="380"
            style={{ border: "0" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Overlaid Search Bar */}
          <div className="absolute left-4 top-4 bg-white rounded-full px-4 py-2 shadow flex items-center gap-2">
            <SearchIcon className="w-4 h-4 text-gray-600" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-40"
            />
            <Send className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
