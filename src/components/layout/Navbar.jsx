import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Pizza, Menu as MenuIcon, X, Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollIntoId = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-pizzaDark/10 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-pizzaOrange flex items-center justify-center text-white relative overflow-hidden transition-transform duration-500 group-hover:rotate-180">
          <Pizza size={22} />
        </div>
        <span className="font-playfair font-bold text-xl md:text-2xl tracking-wider text-pizzaDark uppercase">
          The Rolling <span className="text-pizzaOrange group-hover:text-pizzaGold transition-colors duration-300">Dough</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <nav className="hidden lg:flex items-center gap-8 font-poppins text-xs uppercase tracking-widest font-medium text-pizzaText">
        <a href="#about" onClick={(e) => scrollIntoId(e, "about")} className="hover:text-pizzaOrange transition-colors">Our Story</a>
        <a href="#live-catering" onClick={(e) => scrollIntoId(e, "live-catering")} className="hover:text-pizzaOrange transition-colors">Catering Show</a>
        <a href="#menu" onClick={(e) => scrollIntoId(e, "menu")} className="hover:text-pizzaOrange transition-colors">Menu</a>
        <a href="#packages" onClick={(e) => scrollIntoId(e, "packages")} className="hover:text-pizzaOrange transition-colors">Packages</a>
        <a href="#gallery" onClick={(e) => scrollIntoId(e, "gallery")} className="hover:text-pizzaOrange transition-colors">Gallery</a>
        <a href="#testimonials" onClick={(e) => scrollIntoId(e, "testimonials")} className="hover:text-pizzaOrange transition-colors">Reviews</a>
        <a href="#faq" onClick={(e) => scrollIntoId(e, "faq")} className="hover:text-pizzaOrange transition-colors">FAQ</a>
      </nav>

      {/* CTAs */}
      <div className="hidden lg:flex items-center gap-4">
        <Link 
          to="/admin" 
          className="px-4 py-2 border border-pizzaDark/20 hover:border-pizzaOrange text-pizzaText font-poppins text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          Portal Login
        </Link>
        <a 
          href="#booking-form" 
          onClick={(e) => scrollIntoId(e, "booking-form")}
          className="px-6 py-3 bg-pizzaDark hover:bg-pizzaOrange text-white font-poppins text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
        >
          <span>Book Now</span>
        </a>
      </div>

      {/* Mobile Menu Trigger */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-pizzaDark hover:text-pizzaOrange p-2 transition-colors duration-200"
        aria-label="Toggle Menu"
      >
        {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F8F5F0] pt-24 px-8 pb-10 flex flex-col justify-between"
          >
            <nav className="flex flex-col gap-6 font-playfair text-3xl font-semibold text-pizzaDark">
              <a href="#about" onClick={(e) => scrollIntoId(e, "about")} className="hover:text-pizzaOrange transition-colors">Our Story</a>
              <a href="#live-catering" onClick={(e) => scrollIntoId(e, "live-catering")} className="hover:text-pizzaOrange transition-colors">Live Catering</a>
              <a href="#menu" onClick={(e) => scrollIntoId(e, "menu")} className="hover:text-pizzaOrange transition-colors">Pizza Menu</a>
              <a href="#packages" onClick={(e) => scrollIntoId(e, "packages")} className="hover:text-pizzaOrange transition-colors">Event Packages</a>
              <a href="#gallery" onClick={(e) => scrollIntoId(e, "gallery")} className="hover:text-pizzaOrange transition-colors">Gallery</a>
              <a href="#testimonials" onClick={(e) => scrollIntoId(e, "testimonials")} className="hover:text-pizzaOrange transition-colors">Reviews</a>
              <a href="#faq" onClick={(e) => scrollIntoId(e, "faq")} className="hover:text-pizzaOrange transition-colors">FAQ</a>
            </nav>
            <div className="flex flex-col gap-4">
              <a 
                href="#booking-form"
                onClick={(e) => scrollIntoId(e, "booking-form")}
                className="w-full text-center py-4 bg-pizzaOrange text-white font-poppins font-semibold uppercase tracking-wider"
              >
                Book Your Event
              </a>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-pizzaDark/20 text-pizzaDark font-poppins text-xs font-semibold uppercase tracking-widest"
              >
                Admin Panel Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
