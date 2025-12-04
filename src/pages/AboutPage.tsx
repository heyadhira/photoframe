import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import aboutImg from "../assets/3.jpg";
import canvaImg from "../assets/canva.jpg";
import heroImg from "../assets/hero.jpg";
import lordramaImg from "../assets/lordrama.jpg";
import owlImg from "../assets/owl.jpg";



export default function AboutPage() {
  return (
    <div className="about-theme min-h-screen content-offset">
      <Navbar />

      {/* HERO HEADER */}
      <section
        className="relative mb-16 w-95 mx-auto overflow-hidden rounded-lg "
      >
        <img
          src={aboutImg}
          alt="Decor your home"
          className="w-full h-160 sm:h-[480px] object-fit"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-6 sm:px-10 max-w-2xl space-y-5 hero-fade-up">
            <h1 className="text-white font-rashi text-5xl sm:text-6xl font-extrabold italic leading-tight drop-shadow-2xl mb-6">
              Decor Your Home
              <br />
              With Style
            </h1>

            <p className="text-white/90 text-lg leading-relaxed max-w-md drop-shadow mb-6">
              Because your home isn’t just where you live — it’s where your
              story unfolds. And we’re here to help you fill it with style.
            </p>

            <a
              href="#who-we-are"
              className="premium-btn-white inline-block"
            >
              Start your Journey
            </a>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section id="who-we-are" className="max-w-7xl mx-auto px-4 py-16">
        <div className="soft-card p-10 lg:p-14 space-y-6 card-appear">
          <h2 className="section-title mb-4">
            Who We <span style={{ color: "#14b8a6" }}>Are</span>
          </h2>

          <p>
            We are a small, passionate team of creators, designers, and storytellers who believe
            that art can transform the energy of any room.
          </p>

          <p>
            Our journey began with one vision — to create artwork that makes people feel
            something. Not just decorations, but expressive pieces that add soul to a space.
          </p>

          <p>
            Every collection we create goes through a long process of sketching, refining, 
            color exploration, and visual storytelling.
          </p>

          <p className="text-xl font-bold italic text-[#14b8a6]">
            “Would I hang this in my own home?”
          </p>

          <p>
            If the answer isn’t a confident yes — we don’t publish it.
          </p>

          <p>
            Our inspiration spans minimalism, pop-art, abstract, photography, shapes, patterns,
            and the world around us — creating a blend of fresh, modern, and expressive art.
          </p>

          <p>
            Beyond the artwork, we deeply care about how you feel when you receive it.
            We want your space to feel more YOU.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="soft-card p-10 lg:p-14 space-y-6 card-appear">
          <h2 className="section-title mb-3">
            Why <span style={{ color: "#14b8a6" }}>Choose Us</span>
          </h2>

          <p>
            Choose us because we genuinely care about what goes on your wall. Our
            designs are original, our materials are premium, and our team provides
            real human support — not automated messages.
          </p>

          <p>
            With Decorizz, you're not just buying wall art — you’re bringing home
            something crafted with intention.
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="section-title mb-8">
          Our <span style={{ color: "#8a6d56" }}>Mission</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-7">
          {/* LEFT TEXT BOX */}
          <div className="soft-card md:col-span-2 p-10 space-y-4 card-appear">
            <p>
              Every piece we create is designed to add joy, emotion, and depth
              to your home — one wall at a time.
            </p>

            <p>
              Our mission is simple: make decorating effortless, enjoyable, and 
              meaningful, helping people express personality through living art.
            </p>
          </div>

          {/* IMAGE GRID */}
          <div className="soft-card p-4 card-appear">
            <div className="grid grid-cols-2 gap-3">
              {[
                canvaImg,
                heroImg,
                heroImg,
                owlImg,
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-full h-28 object-cover rounded-xl hover-lift"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY WE STAND OUT */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="soft-card p-10 lg:p-14 space-y-6 card-appear">
          <h2 className="section-title mb-3">
            Why We <span style={{ color: "#14b8a6" }}>Stand Out</span>
          </h2>

          <p>At Decorizz, we don’t mass-produce art — we create it with heart.</p>

          <p>
            Every artwork is thoughtfully designed, carefully reviewed, and crafted to bring
            warmth and character into your space.
          </p>

          <p>
            When you shop with Decorizz, you're choosing creativity, not templates.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="soft-card p-10 lg:p-14 space-y-8 card-appear">
          <h2 className="section-title">
            Contact <span style={{ color: "#14b8a6" }}>Us</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <ContactItem
              icon={<MapPin className="w-7 h-7 text-[#8a6d56]" />}
              title="Address"
              text="Gurugram road Near Subhash chowk Shaktifarm market Sitarganj Udham Singh Nagar 263151"
            />
            <ContactItem
              icon={<Phone className="w-7 h-7 text-[#8a6d56]" />}
              title="Phone"
              text="+91 9705180483"
            />
            <ContactItem
              icon={<Mail className="w-7 h-7 text-[#8a6d56]" />}
              title="Email"
              text="contact@decorizz.com"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactItem({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 hover-lift">
      {icon}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
