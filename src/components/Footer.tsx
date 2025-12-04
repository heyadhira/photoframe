import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logoImage from "../assets/logo-r.png";


export function Footer() {
  return (
    <footer className="mt-20" style={{ backgroundColor: '#e7dfd0', color: '#1f2937' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* logo */}
          <div className="flex items-center md:block">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImage} alt="Decorizz" className="h-10 w-auto" />
              <span className="text-xl tracking-wide" style={{ fontWeight: 800 }}>DECORIZZ</span>
            </Link>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: '#0ea5a4', fontWeight: 700 }}>Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/shop" className="hover:underline">Products</Link></li>
              <li><Link to="/shop" className="hover:underline">Frames</Link></li>
              <li><a href="#" className="hover:underline">Returns Policy</a></li>
              <li><a href="#" className="hover:underline">Term & Condition</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: '#0ea5a4', fontWeight: 700 }}>Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: '#0ea5a4', fontWeight: 700 }}>Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0ea5a4', color: '#fff' }}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 700 }}>Call us</p>
                  <p>+91 970 5180 483</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0ea5a4', color: '#fff' }}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 700 }}>Mail Us</p>
                  <p>info@decorizz.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-24 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0ea5a4', color: '#fff' }}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 700 }}>Address</p>
                  <p>Gurugram road Near Subhash chowk Shaktifarm market Sitarganj</p>
                  <p>Udham Singh Nagar 263151</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10" style={{ borderTop: '1.5px solid #0ea5a4' }}></div>
      </div>
    </footer>
  );
}
