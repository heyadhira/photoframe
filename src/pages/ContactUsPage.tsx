import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl" style={{ fontWeight: 700, color: '#1f2937' }}>
              Contact Us
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                    placeholder="Write your message here"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg shadow-lg transition"
                    style={{ backgroundColor: '#14b8a6', color: 'white', fontWeight: 600 }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0d9488'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14b8a6'; }}
                  >
                    Send Message
                  </button>
                  <button
                    type="reset"
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                    onClick={() => setForm({ name: '', email: '', phone: '', subject: '', message: '' })}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reach us directly</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>
                    Gurugram road Near Subhash chowk Shaktifarm market Sitarganj<br />
                    Udham singh nagar 263151
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>+91 9705180483</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>contact@decorizz.com</span>
                </li>
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-24 rounded-lg border border-gray-200 bg-gray-50"></div>
                <div className="h-24 rounded-lg border border-gray-200 bg-gray-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

