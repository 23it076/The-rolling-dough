import React, { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-pizzaOrange transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to Top"
      className="fixed bottom-8 left-8 z-40 p-3 bg-[#111111] text-white border border-white/20 shadow-xl hover:bg-pizzaOrange hover:border-pizzaOrange transition-all duration-300 group"
    >
      <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
    </button>
  );
}

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/919898112345?text=Hello%20The%20Rolling%20Dough!%20I%20would%20like%20to%20inquire%20about%20live%20pizza%20catering%20for%20my%20event."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
      className="fixed bottom-24 right-8 z-40 p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    >
      <MessageCircle size={24} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-poppins text-xs font-semibold uppercase tracking-wider whitespace-nowrap pl-0 group-hover:pl-2">
        Chat on WhatsApp
      </span>
    </a>
  );
}

export function SkeletonLoader({ className = "h-4 w-full" }) {
  return (
    <div className={`bg-pizzaDark/10 animate-pulse rounded ${className}`} />
  );
}
