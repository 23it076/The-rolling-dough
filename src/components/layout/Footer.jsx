import React from "react";
import { Link } from "react-router-dom";
import { Camera, Phone, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-pizzaDark text-white pt-24 pb-12 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div>
            <span className="font-playfair font-bold text-2xl tracking-wider text-white uppercase block mb-4">
              The Rolling <span className="text-pizzaOrange">Dough</span>
            </span>
            <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
              Premium Live Neapolitan Pizza Catering. Stretching, tossing, and baking fresh live pizzas inside specialized high-heat stone ovens at your premium celebrations.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram Profile" className="p-2 border border-white/10 hover:border-pizzaOrange text-white/60 hover:text-pizzaOrange transition-colors">
                <Camera size={18} />
              </a>
              <a href="tel:+919898112345" className="p-2 border border-white/10 hover:border-pizzaOrange text-white/60 hover:text-pizzaOrange transition-colors">
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-3 font-poppins text-xs uppercase tracking-widest text-white/60">
              <li><a href="#about" className="hover:text-pizzaOrange transition-colors">Our Story</a></li>
              <li><a href="#live-catering" className="hover:text-pizzaOrange transition-colors">Catering Show</a></li>
              <li><a href="#menu" className="hover:text-pizzaOrange transition-colors">Pizza Menu</a></li>
              <li><a href="#packages" className="hover:text-pizzaOrange transition-colors">Packages</a></li>
              <li><a href="#booking-form" className="hover:text-pizzaOrange transition-colors">Book Event</a></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-6">Operations</h4>
            <ul className="space-y-3 text-sm text-white/60 font-light">
              <li className="flex justify-between"><span>Mon — Thu</span> <span>11:00 AM — 10:00 PM</span></li>
              <li className="flex justify-between"><span>Fri — Sun</span> <span>11:00 AM — 11:30 PM</span></li>
              <li className="text-pizzaGold text-xs font-poppins uppercase tracking-wider pt-2 flex items-center gap-2">
                <Clock size={12} />
                <span>Live Event Catering Available 24/7</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-playfair font-bold text-lg mb-6">Headquarters</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li className="flex gap-2">
                <span className="text-pizzaOrange">HQ:</span>
                <span>Off S.G. Highway, Bodakdev, Ahmedabad, Gujarat 380054</span>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="text-pizzaOrange shrink-0" />
                <a href="mailto:hello@therollingdough.in" className="hover:text-white transition-colors">hello@therollingdough.in</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-light">
          <p>© {new Date().getFullYear()} The Rolling Dough. All rights reserved.</p>
          <p>Handcrafted by Creative Agency Specialists.</p>
        </div>
      </div>
    </footer>
  );
}
