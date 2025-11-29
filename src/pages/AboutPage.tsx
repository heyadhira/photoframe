import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Target, Users, Award, Mail, Phone, MapPin } from "lucide-react";
import aboutImg from "../assets/logo.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO HEADER */}


      {/* ABOUT US CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm space-y-6"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            About Us — <span style={{ color: "#14b8a6" }}>Decorizz</span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Decorizz was born from one simple belief: every home deserves to look
            beautiful without feeling complicated or expensive.
          </p>

          <p className="text-gray-700 leading-relaxed">
            A single piece of art can change the entire mood of a room. It can
            bring warmth, spark emotion, or add meaning to an empty wall. That’s
            why Decorizz exists — not just to sell artwork, but to help people
            create homes that feel expressive, stylish, and alive.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Every artwork goes through hours of brainstorming, sketching,
            polishing, and visualizing how it will look in your space. We don’t
            believe in generic décor. We believe in pieces that have personality,
            emotion, and their own story.
          </p>

          <p className="text-xl font-bold" style={{ color: "#14b8a6" }}>
            ✨ Decor Your Home With Style ✨
          </p>

          <p className="text-gray-700 leading-relaxed">
            Whether you're refreshing a room or designing a cozy new corner,
            Decorizz is here to make the journey easy and joyful — with original
            artwork, premium materials, and designs that speak to the soul.
          </p>

          <p className="text-gray-700 leading-relaxed italic">
            Because your home isn't just where you live — it's where your story
            unfolds. And we’re here to help you tell it with style.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm space-y-6"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Who We <span style={{ color: "#14b8a6" }}>Are</span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            We’re a small and passionate team — creators, designers,
            storytellers, and art lovers — who believe that art can change the way
            a room feels the moment you walk in.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Our journey began with the desire to create artwork that speaks to
            people. Not generic decorations—but pieces that make you pause, smile,
            think, or feel something real.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We spend hours refining colors, textures, sketches, and designs,
            constantly asking ourselves:
          </p>

          <p
            className="text-lg font-semibold italic"
            style={{ color: "#14b8a6" }}
          >
            “Would I hang this in my own home?”
          </p>

          <p className="text-gray-700 leading-relaxed">
            If the answer isn’t a strong yes — we don’t publish it.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Our inspirations come from everywhere: calm minimalism, vibrant
            pop-art, modern abstract, street culture, photography, and the world
            around us. This diversity keeps our collections fresh, unique, and
            full of personality.
          </p>

          <p className="text-gray-700 leading-relaxed">
            But beyond the artwork itself, we deeply care about how our customers
            feel. We want you to smile when your order arrives. We want your space
            to feel more “you.”
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm space-y-6"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why <span style={{ color: "#14b8a6" }}>Choose Us</span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Choose us because we genuinely care about what goes on your wall. Our
            designs are original, our materials are premium, and our team provides
            real human support — not automated messages.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We believe in fair pricing, honest service, and décor that transforms
            how a room feels. With Decorizz, you're not just buying wall art —
            you’re bringing home something crafted with intention.
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm space-y-6"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our <span style={{ color: "#14b8a6" }}>Mission</span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Our mission is simple: make decorating effortless, enjoyable, and
            meaningful. We want people to express personality through art that
            feels alive — from calming abstracts to bold portraits and expressive
            pop-art.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Every piece we create is designed to add joy, emotion, and depth to
            your home — one wall at a time.
          </p>
        </div>
      </section>

      {/* WHY WE STAND OUT */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm space-y-6"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why We <span style={{ color: "#14b8a6" }}>Stand Out</span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            At Decorizz, we don’t mass-produce art — we create it with heart.
            Every artwork is thoughtfully designed, carefully reviewed, and
            crafted to bring real warmth and character into your space.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We are a small team, not a factory. Every order gets personal
            attention. Our art is original, our quality is high, and our process
            is honest, simple, and customer-first.
          </p>

          <p className="text-gray-700 leading-relaxed">
            When you shop with Decorizz, you’re choosing artwork crafted with
            passion — not templates.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div
          className="bg-white border rounded-xl p-8 lg:p-12 shadow-sm"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Contact <span style={{ color: "#14b8a6" }}>Us</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="w-7 h-7" style={{ color: "#14b8a6" }} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">Gurugram road Near Subhash chowk Shaktifarm market Sitarganj Udham singh nagar 263151</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-7 h-7" style={{ color: "#14b8a6" }} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 9705180483</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-7 h-7" style={{ color: "#14b8a6" }} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">contact@decorizz.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
