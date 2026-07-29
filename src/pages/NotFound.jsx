import React from "react";
import { Link } from "react-router-dom";
import { Pizza } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pizzaDark text-white flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 bg-pizzaOrange/10 rounded-full flex items-center justify-center text-pizzaOrange mb-6">
        <Pizza size={36} />
      </div>
      <h1 className="font-playfair text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
      <h2 className="font-playfair text-2xl md:text-3xl text-pizzaOrange mb-6">Slice Not Found</h2>
      <p className="text-sm text-white/60 max-w-md font-light mb-8">
        The page you are looking for has been devoured or moved to another section.
      </p>
      <Link 
        to="/"
        className="px-8 py-4 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins text-xs font-semibold uppercase tracking-widest transition-colors"
      >
        Return to Home Pizzeria
      </Link>
    </div>
  );
}
