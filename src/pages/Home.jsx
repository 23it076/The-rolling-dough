import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { 
  Flame, ArrowRight, Check, Award, ShieldCheck, ChefHat, Sparkles, Clock, 
  Map, Phone, Mail, ChevronDown, Star, Play, X, User, Users, Calendar as CalendarIcon, 
  MapPin, CheckCircle, Flame as FlameIcon, Heart, Info, ArrowLeft, RefreshCw, Layers
} from "lucide-react";
import SEO from "../components/common/SEO";
import { ScrollProgressBar, BackToTopButton, WhatsAppFloatingButton } from "../components/common/MicroInteractions";
import { addBooking, getMenu, getGallery, getReviews } from "../firebase/services";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [activeMenuCategory, setActiveMenuCategory] = useState("All");
  const [activeGalleryCategory, setActiveGalleryCategory] = useState("All");
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [selectedIngredientModal, setSelectedIngredientModal] = useState(null);
  const [activeLocation, setActiveLocation] = useState("Ahmedabad");

  // Video State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // ----------------------------------------------------
  // MULTI-STEP BOOKING WIZARD STATE
  // ----------------------------------------------------
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    eventType: "Wedding",
    eventDate: "",
    guestCount: 50,
    city: "Ahmedabad",
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [bookingReferenceId, setBookingReferenceId] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Refs for Animations
  const storyImgRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const m = await getMenu();
      const g = await getGallery();
      const r = await getReviews();
      setMenuItems(m);
      setGalleryItems(g);
      setReviews(r);
    };
    loadData();

    // Keyboard navigation for lightbox
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveLightboxImage(null);
        setSelectedIngredientModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // GSAP parallax reveal trigger
    const ctx = gsap.context(() => {
      if (storyImgRef.current) {
        gsap.fromTo(storyImgRef.current,
          { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", scale: 1.1 },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            scale: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: storyImgRef.current,
              start: "top 80%",
            }
          }
        );
      }
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      ctx.revert();
    };
  }, []);

  // Multi-step form submission
  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    const refId = "TRD-" + Math.floor(100000 + Math.random() * 900000);
    
    try {
      await addBooking({ ...bookingData, referenceId: refId });
      setBookingReferenceId(refId);
      setIsSubmittingForm(false);
      setBookingSubmitted(true);
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#F97316", "#D4AF37", "#111111"]
      });
    } catch (err) {
      console.error(err);
      setIsSubmittingForm(false);
    }
  };

  const menuCategories = ["All", ...new Set(menuItems.map(item => item.category))];
  const filteredMenuItems = activeMenuCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === activeMenuCategory);

  const galleryCategories = ["All", ...new Set(galleryItems.map(item => item.category))];
  const filteredGalleryItems = activeGalleryCategory === "All"
    ? galleryCategories.length > 0 && activeGalleryCategory !== "All"
      ? galleryItems.filter(item => item.category === activeGalleryCategory)
      : galleryItems
    : galleryItems;

  const getCityDetails = (city) => {
    const locations = {
      Ahmedabad: { address: "102, Premium Commerce Zone, Off SG Highway, Ahmedabad, Gujarat 380054", phone: "+91 98981 12345", email: "ahmedabad@therollingdough.in", events: "450+ Events Hosted" },
      Vadodara: { address: "Bespoke Culinary Hub, Alkapuri Road, Vadodara, Gujarat 390007", phone: "+91 98981 12346", email: "baroda@therollingdough.in", events: "320+ Events Hosted" },
      Nadiad: { address: "Rolling Dough Station, College Road, Nadiad, Gujarat 387001", phone: "+91 98981 12348", email: "nadiad@therollingdough.in", events: "80+ Events Hosted" },
      Anand: { address: "The Craft Oven, Vallabh Vidyanagar Road, Anand, Gujarat 388120", phone: "+91 98981 12347", email: "anand@therollingdough.in", events: "150+ Events Hosted" }
    };
    return locations[city] || locations.Ahmedabad;
  };

  return (
    <div className="pt-16 relative">
      <SEO />
      <ScrollProgressBar />
      <BackToTopButton />
      <WhatsAppFloatingButton />

      {/* ----------------------------------------------------
          1. CINEMATIC HERO SECTION
          ---------------------------------------------------- */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-pizzaDark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1920&q=80" 
            alt="Authentic Neapolitan Pizza Oven"
            className="w-full h-full object-cover filter brightness-30 grayscale-10 contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pizzaDark via-pizzaDark/45 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pt-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 text-pizzaGold font-poppins text-xs font-semibold uppercase tracking-widest"
          >
            <Flame size={14} className="text-pizzaOrange animate-pulse" />
            <span>Neapolitan Gastronomy • Live On-Site Catering</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold tracking-tight leading-none mb-8"
          >
            Authentic Neapolitan <br className="hidden md:inline" />
            <span className="italic text-pizzaOrange">Pizza Experience</span> At Your Event
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-white/90 text-sm md:text-base font-poppins uppercase tracking-widest mb-12"
          >
            <span>Fresh.</span>
            <span>Handcrafted.</span>
            <span>Unlimited.</span>
            <span>Served Live.</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16"
          >
            <a 
              href="#booking-wizard"
              className="px-8 py-4 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins font-semibold uppercase tracking-widest transition-all duration-300 text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <span>Book Your Event</span>
              <ArrowRight size={16} />
            </a>
            <button 
              onClick={() => setIsPlayingVideo(true)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-poppins font-semibold uppercase tracking-widest transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
              <Play size={16} fill="currentColor" className="text-pizzaOrange" />
              <span>Watch Experience</span>
            </button>
          </motion.div>

          {/* Hero Statistics Bar */}
          <div className="w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white">
            <div className="text-center">
              <span className="font-playfair text-3xl md:text-4xl font-bold text-pizzaOrange block">1,000+</span>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-white/70">Events Catered</span>
            </div>
            <div className="text-center">
              <span className="font-playfair text-3xl md:text-4xl font-bold text-pizzaOrange block">15,000+</span>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-white/70">Guests Served</span>
            </div>
            <div className="text-center">
              <span className="font-playfair text-3xl md:text-4xl font-bold text-pizzaOrange block">4</span>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-white/70">Cities Covered</span>
            </div>
            <div className="text-center">
              <span className="font-playfair text-3xl md:text-4xl font-bold text-pizzaGold block">5 ★</span>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-white/70">Client Rating</span>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          2. OUR STORY & BRAND TIMELINE
          ---------------------------------------------------- */}
      <section id="about" className="py-32 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            
            <div ref={storyImgRef} className="relative aspect-[4/5] overflow-hidden bg-zinc-800 border-8 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=1000&q=80" 
                alt="Chef spinning pizza dough live"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-pizzaOrange/5 mix-blend-overlay"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-pizzaDark p-6 text-white border border-pizzaGold/35">
                <span className="text-pizzaGold font-poppins text-[10px] uppercase tracking-widest block mb-1">Our Heritage</span>
                <p className="font-playfair italic text-sm text-[#F8F5F0]/90">\"We bring the stone hearth, the slow dough, and the fiery theater to your lawns, rooftops, and halls.\"</p>
              </div>
            </div>

            <div>
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Authentic Italian Heritage</span>
              <h2 className="font-playfair text-4xl md:text-6xl text-pizzaDark font-semibold leading-tight mb-8">
                Crafting Neapolitan <span className="italic text-pizzaOrange">Artistry</span> Live For You.
              </h2>
              <div className="space-y-6 text-pizzaText/85 text-base md:text-lg leading-relaxed font-light">
                <p>
                  The Rolling Dough was born from a singular obsession: to bring the authentic theatrical romance of a Neapolitan pizzeria directly to your celebration. We realized that catering should never feel like a compromise; it should be a live culinary performance that captivates all five senses.
                </p>
                <p>
                  Every single dough ball we stretch at your venue has been nurtured for 48 hours, using the legendary Caputo "00" flour from Naples, naturally raising to create that cloud-like, charred "leopard-spotted" crust. Coated in sweet crushed San Marzano tomatoes and rich Fior di Latte mozzarella, our pizzas bake in just 90 seconds inside our custom-engineered ovens reaching 450°C.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="p-4 bg-white border border-pizzaDark/5">
                  <h3 className="font-playfair text-xl font-bold text-pizzaDark">Our Mission</h3>
                  <p className="text-xs text-pizzaText/70 mt-2">Delivering zero-compromise live culinary theater for upscale catering celebrations.</p>
                </div>
                <div className="p-4 bg-white border border-pizzaDark/5">
                  <h3 className="font-playfair text-xl font-bold text-pizzaDark">Our Vision</h3>
                  <p className="text-xs text-pizzaText/70 mt-2">To be Gujarat's finest choice for live Italian gastronomy & premium wedding shows.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Brand Milestone Timeline */}
          <div className="border-t border-pizzaDark/10 pt-20">
            <div className="text-center mb-16">
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-2">Our Evolution</span>
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-pizzaDark">Journey to Culinary Excellence</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { year: "2021", title: "The Spark", desc: "Imported our first high-heat stone hearth oven directly from Naples." },
                { year: "2022", title: "Live Catering Launch", desc: "Pioneered live wood-fired Neapolitan pizza catering across Ahmedabad." },
                { year: "2023", title: "Regional Expansion", desc: "Extended operations to luxury villa events in Vadodara and Anand." },
                { year: "2024+", title: "1,000+ Events", desc: "Catering high-profile weddings, corporate galas, and private celebrations." }
              ].map((m, i) => (
                <div key={i} className="bg-white p-6 border border-pizzaDark/5 relative">
                  <span className="font-playfair text-3xl font-bold text-pizzaOrange block mb-2">{m.year}</span>
                  <h4 className="font-playfair font-semibold text-lg text-pizzaDark mb-2">{m.title}</h4>
                  <p className="text-xs text-pizzaText/70 font-light leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          3. MEET OUR CHEFS & EQUIPMENT SHOWCASE
          ---------------------------------------------------- */}
      <section className="py-32 bg-pizzaDark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Master Pizzaiolos</span>
              <h2 className="font-playfair text-4xl md:text-6xl font-semibold mb-8">The Hands Behind The Flame</h2>
              <p className="text-[#F8F5F0]/75 font-light leading-relaxed text-base md:text-lg mb-8">
                Our chefs are artisans trained in Neapolitan dough stretching and high-heat stone hearth baking. They don't just cook; they perform a live culinary dance for your guests, tossing dough with precision and creating an unforgettable interactive atmosphere.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pizzaOrange/10 text-pizzaOrange shrink-0">
                    <ChefHat size={22} />
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold">48-Hour Maturation Discipline</h4>
                    <p className="text-xs text-white/60 mt-1">Naturally raised sourdough for optimal digestibility and cloud-like crust expansion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pizzaOrange/10 text-pizzaOrange shrink-0">
                    <FlameIcon size={22} />
                  </div>
                  <div>
                    <h4 className="font-playfair text-xl font-bold">450°C Stone Ovens</h4>
                    <p className="text-xs text-white/60 mt-1">Blazing hot stone hearths locking in moisture and producing classic leopard-spotted charring.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80" 
                alt="Chef placing pizza in stone oven" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pizzaDark via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-pizzaGold text-[10px] font-poppins uppercase tracking-widest block mb-1">Live Venue Setup</span>
                <p className="font-playfair text-lg text-white font-medium">Bespoke mobile pizzerias matching your outdoor or indoor aesthetic.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. LIVE CATERING PROCESS WORKFLOW
          ---------------------------------------------------- */}
      <section id="live-catering" className="py-32 bg-[#F8F5F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Behind the Scenes</span>
            <h2 className="font-playfair text-4xl md:text-6xl font-semibold text-pizzaDark">The Live Choreography</h2>
            <p className="text-pizzaText/65 font-light mt-4 max-w-xl mx-auto text-sm md:text-base">Witness how we transform your space into an authentic Neapolitan hub from start to finish.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { t: "1. Bespoke Booking", d: "We curate a customized menu matching your event's theme, guest size, and dietary selections." },
              { t: "2. Precision Arrival", d: "Our team arrives 2 hours before service. We construct our minimalist live pizza station and organize ingredients." },
              { t: "3. Professional Setup", d: "We ignite the high-heat stone ovens, bringing temperatures up to a blazing 450°C." },
              { t: "4. Slow-fermented Dough", d: "Watch the magic as our chefs hand-stretch and toss the 48-hour slow-matured Caputo dough." },
              { t: "5. Live Cooking", d: "Pizzas enter the stone ovens, rising, bubbling, and cooking to charred perfection in 90 seconds." },
              { t: "6. Unlimited Serving", d: "Guests indulge in endless helpings of hot, bubbling artisanal pizzas sliced fresh onto rustic boards." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-8 border border-pizzaDark/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-pizzaGold block mb-2">Stage {idx + 1}</span>
                  <h3 className="font-playfair text-xl font-bold text-pizzaDark mb-4">{step.t}</h3>
                  <p className="text-sm text-pizzaText/75 leading-relaxed font-light">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. MENU PAGE WITH INGREDIENT MODALS & BADGES
          ---------------------------------------------------- */}
      <section id="menu" className="py-32 bg-pizzaDark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <div>
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Live Menu Selections</span>
              <h2 className="font-playfair text-4xl md:text-6xl font-semibold">The Wood-Fired Menu</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 w-full lg:w-auto">
              {menuCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMenuCategory(cat)}
                  className={`px-5 py-2 font-poppins text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeMenuCategory === cat 
                      ? "bg-pizzaOrange text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="bg-[#1A1A1A] border border-white/10 hover:border-pizzaOrange/30 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.isPopular && (
                        <span className="bg-pizzaOrange text-white text-[9px] font-poppins font-semibold uppercase tracking-widest px-3 py-1">Popular</span>
                      )}
                      {item.category === "Vegetarian" && (
                        <span className="bg-green-600 text-white text-[9px] font-poppins font-semibold uppercase tracking-widest px-3 py-1">Veg</span>
                      )}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-baseline mb-3">
                        <h3 className="font-playfair text-xl md:text-2xl font-semibold text-white">{item.name}</h3>
                        <span className="text-[10px] font-poppins text-pizzaGold tracking-widest uppercase">{item.category}</span>
                      </div>
                      <p className="text-sm text-white/70 font-light leading-relaxed mb-6 line-clamp-2">{item.ingredients}</p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs font-poppins font-semibold">
                      <button 
                        onClick={() => setSelectedIngredientModal(item)}
                        className="text-pizzaGold hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Info size={14} />
                        <span>View Ingredients</span>
                      </button>
                      <span className="text-pizzaOrange">{item.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Ingredient Detail Modal */}
        <AnimatePresence>
          {selectedIngredientModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={() => setSelectedIngredientModal(null)}>
              <div className="bg-[#1A1A1A] border border-white/10 p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedIngredientModal(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                  <X size={20} />
                </button>
                <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-2">{selectedIngredientModal.category} Pizza</span>
                <h3 className="font-playfair text-3xl font-bold text-white mb-4">{selectedIngredientModal.name}</h3>
                <img src={selectedIngredientModal.image} alt={selectedIngredientModal.name} className="w-full h-48 object-cover mb-6 border border-white/10" />
                <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-pizzaGold mb-2">Imported Ingredients:</h4>
                <p className="text-sm text-white/80 font-light leading-relaxed mb-6">{selectedIngredientModal.ingredients}</p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-semibold text-pizzaOrange">{selectedIngredientModal.price}</span>
                  <a href="#booking-wizard" onClick={() => setSelectedIngredientModal(null)} className="px-6 py-2 bg-pizzaOrange text-white font-poppins text-xs uppercase font-semibold">Book For Event</a>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ----------------------------------------------------
          6. PACKAGES & PRICING
          ---------------------------------------------------- */}
      <section id="packages" className="py-32 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Packages & Pricing</span>
            <h2 className="font-playfair text-4xl md:text-6xl font-semibold text-pizzaDark">Catering Packages</h2>
            <p className="text-pizzaText/65 font-light mt-4 max-w-xl mx-auto text-sm md:text-base">We custom construct our live pizzerias matching your event size, theme, and aesthetic layout.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Celebration Party", guests: "30 - 70 Guests", features: ["1 Live High-Heat Oven", "2 Signature Pizzas", "1 Dessert Pizza", "Standard prep station"], price: "Starts at ₹500/head" },
              { title: "Grand Wedding", guests: "200 - 1000+ Guests", features: ["Multiple Live Ovens", "4 Signature Pizzas", "2 Premium Specialties", "Golden luxury station"], price: "Custom Proposal" },
              { title: "Corporate Gala", guests: "100 - 300 Guests", features: ["2 Live High-Heat Ovens", "3 Premium Pizzas", "1 Special White Base Pizza", "Minimalist layout setup"], price: "Starts at ₹600/head" },
              { title: "Society Festival", guests: "150+ Guests", features: ["Fast 90s stone ovens", "Choice of 3 toppings", "Unlimited menu runs", "Biodegradable disposables"], price: "Custom Quote" }
            ].map((pkg, idx) => (
              <div key={idx} className="bg-white p-8 border border-pizzaDark/5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-pizzaDark mb-2">{pkg.title}</h3>
                  <span className="text-xs text-pizzaGold font-poppins uppercase tracking-wider block mb-6">{pkg.guests}</span>
                  <ul className="space-y-3 mb-8 text-sm text-pizzaText/75 font-light">
                    {pkg.features.map((f, i) => <li key={i} className="flex items-center gap-2"><Check size={14} className="text-pizzaOrange" /> {f}</li>)}
                  </ul>
                </div>
                <div className="pt-6 border-t border-pizzaDark/5 flex flex-col gap-4">
                  <span className="text-xl font-poppins font-bold text-pizzaOrange">{pkg.price}</span>
                  <a href="#booking-wizard" className="w-full text-center py-3 bg-pizzaDark text-white hover:bg-pizzaOrange font-poppins text-xs font-semibold uppercase tracking-widest transition-all duration-300">Enquire</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          7. MASONRY GALLERY WITH LIGHTBOX
          ---------------------------------------------------- */}
      <section id="gallery" className="py-32 bg-pizzaDark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <div>
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Visual Journey</span>
              <h2 className="font-playfair text-4xl md:text-6xl font-semibold">Captured Live Moments</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 w-full lg:w-auto">
              {galleryCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryCategory(cat)}
                  className={`px-5 py-2 font-poppins text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeGalleryCategory === cat 
                      ? "bg-pizzaOrange text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGalleryItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  key={item.id} 
                  className="relative overflow-hidden group cursor-zoom-in aspect-square bg-[#1A1A1A]"
                  onClick={() => setActiveLightboxImage(item)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-95 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pizzaDark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-pizzaOrange font-poppins text-[10px] uppercase tracking-widest font-semibold mb-1">Click to Zoom</span>
                    <p className="font-playfair text-sm text-white font-medium">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeLightboxImage && (
            <div 
              className="fixed inset-0 z-50 bg-pizzaDark/95 flex items-center justify-center p-6"
              onClick={() => setActiveLightboxImage(null)}
            >
              <div className="relative max-w-4xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <img 
                  src={activeLightboxImage.image} 
                  alt={activeLightboxImage.title}
                  className="max-w-full max-h-[80vh] object-contain border-4 border-white/10"
                />
                <div className="bg-pizzaDark p-4 text-center">
                  <p className="font-playfair text-lg text-white">{activeLightboxImage.title}</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ----------------------------------------------------
          8. TESTIMONIALS
          ---------------------------------------------------- */}
      <section id="testimonials" className="py-32 bg-[#F8F5F0] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Host Testimonials</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-pizzaDark">Praise From Exceptional Celebrations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((t, idx) => (
              <div key={idx} className="bg-white p-8 border border-pizzaDark/5 flex flex-col justify-between relative shadow-sm">
                <div>
                  <div className="flex gap-1 text-pizzaGold mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-pizzaText/85 font-light leading-relaxed italic mb-8">
                    "{t.review}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {t.photo && <img src={t.photo} alt={t.customerName} className="w-12 h-12 rounded-full object-cover" />}
                  <div>
                    <h4 className="font-playfair font-bold text-pizzaDark">{t.customerName}</h4>
                    <p className="text-xs text-pizzaOrange font-poppins uppercase tracking-wider mt-1">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          9. OPERATING CITIES INTERACTIVE SWITCHER
          ---------------------------------------------------- */}
      <section className="py-32 bg-pizzaDark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Our Operations</span>
              <h2 className="font-playfair text-4xl md:text-6xl font-semibold mb-8">Serving Premium Pizzerias in 4 Cities</h2>
              <p className="text-white/70 font-light leading-relaxed mb-8">
                We travel directly to your private estate, luxury hotel hall, corporate headquarters, or garden villa. Choose your city to view contact details:
              </p>

              <div className="grid grid-cols-2 gap-4">
                {["Ahmedabad", "Vadodara", "Nadiad", "Anand"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveLocation(city)}
                    className={`py-4 px-6 font-poppins text-xs font-semibold uppercase tracking-wider border transition-all duration-300 text-left flex justify-between items-center ${
                      activeLocation === city 
                        ? "bg-pizzaOrange border-pizzaOrange text-white" 
                        : "border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-8 md:p-12 border border-white/10 relative">
              <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-pizzaGold block mb-2">Local Branch Profile</span>
              <h3 className="font-playfair text-3xl font-semibold mb-6">{activeLocation} HQ</h3>
              <div className="space-y-6 text-white/75 text-sm md:text-base font-light">
                <p className="flex items-start gap-4">
                  <span className="text-pizzaOrange font-bold shrink-0 mt-0.5">📍</span>
                  <span>{getCityDetails(activeLocation).address}</span>
                </p>
                <p className="flex items-center gap-4">
                  <Phone size={18} className="text-pizzaOrange shrink-0" />
                  <a href={`tel:${getCityDetails(activeLocation).phone}`} className="hover:text-pizzaOrange transition-colors">{getCityDetails(activeLocation).phone}</a>
                </p>
                <p className="flex items-center gap-4">
                  <Mail size={18} className="text-pizzaOrange shrink-0" />
                  <a href={`mailto:${getCityDetails(activeLocation).email}`} className="hover:text-pizzaOrange transition-colors">{getCityDetails(activeLocation).email}</a>
                </p>
                <p className="pt-6 border-t border-white/10 text-pizzaGold font-poppins text-xs font-semibold uppercase tracking-wider">
                  {getCityDetails(activeLocation).events}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          10. FAQ ACCORDION
          ---------------------------------------------------- */}
      <section id="faq" className="py-32 bg-[#F8F5F0]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Frequently Asked Questions</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-pizzaDark">Answering Your Doubts</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How many hours of live service do you provide?", a: "Our standard catering packages include 3 hours of live serving time. We arrive 2 hours prior to service to set up the ovens, prep stations, and light the wood-fired burners." },
              { q: "Do you cater for smaller gatherings?", a: "Yes, we cater for events ranging from intimate house parties of 30 guests up to massive grand weddings and corporate festivals of 1000+ attendees." },
              { q: "Do you offer gluten-free or vegan options?", a: "We offer vegan cheese substitutes and vegetarian specialties. However, because our workspace handles flour constantly, we cannot guarantee a 100% cross-contamination-free environment for severe celiacs." },
              { q: "What do you require at the event venue?", a: "We only need an open flat space of approximately 10x10 feet for our live station. If setting up indoors, we require a well-ventilated zone or balcony space. We bring all our own prep tables, ovens, firewood/fuel, and utensils." }
            ].map((faq, index) => {
              const [isOpen, setIsOpen] = useState(index === 0);
              return (
                <div key={index} className="bg-white border border-pizzaDark/5 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-6 px-8 flex justify-between items-center text-left hover:bg-pizzaOrange/5 transition-colors group"
                  >
                    <span className="font-playfair font-bold text-lg md:text-xl text-pizzaDark group-hover:text-pizzaOrange transition-colors">{faq.q}</span>
                    <ChevronDown size={18} className={`text-pizzaOrange transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-8 pb-6 text-sm md:text-base text-pizzaText/75 font-light leading-relaxed border-t border-pizzaDark/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          11. 5-STEP INTERACTIVE BOOKING WIZARD
          ---------------------------------------------------- */}
      <section id="booking-wizard" className="py-32 bg-pizzaDark text-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pizzaOrange font-poppins text-xs font-bold uppercase tracking-widest block mb-3">Event Reservations</span>
            <h2 className="font-playfair text-4xl md:text-6xl font-semibold">Reserve Your Live Pizzeria</h2>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 p-8 md:p-12 relative shadow-2xl">
            {bookingSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-playfair text-3xl font-bold mb-2">Booking Inquiry Confirmed</h3>
                <p className="text-xs font-poppins text-pizzaGold uppercase tracking-widest mb-4">Reference ID: {bookingReferenceId}</p>
                <p className="text-sm text-white/70 font-light max-w-md mx-auto mb-8">
                  Thank you, {bookingData.name}! Our event manager will contact you at {bookingData.phone} within 2 hours to confirm details for your {bookingData.eventType} in {bookingData.city}.
                </p>
                <button 
                  onClick={() => { setBookingSubmitted(false); setBookingStep(1); }}
                  className="px-8 py-3 bg-pizzaOrange text-white font-poppins text-xs font-semibold uppercase tracking-widest"
                >
                  Start New Inquiry
                </button>
              </motion.div>
            ) : (
              <div>
                {/* Stepper Progress Bar */}
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6 font-poppins text-xs uppercase tracking-widest">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                        bookingStep === s ? "bg-pizzaOrange text-white" : bookingStep > s ? "bg-pizzaGold text-pizzaDark" : "bg-white/10 text-white/40"
                      }`}>
                        {bookingStep > s ? "✓" : s}
                      </div>
                      <span className="hidden sm:inline text-white/60">
                        {s === 1 ? "Event" : s === 2 ? "Date" : s === 3 ? "Guests" : s === 4 ? "Contact" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleWizardSubmit}>
                  {/* Step 1: Event Type */}
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold mb-4">Step 1: Select Event Type</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["Wedding", "Corporate", "Birthday", "House Party", "Society Event"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, eventType: type })}
                            className={`p-6 border text-left font-poppins text-sm uppercase tracking-wider transition-all ${
                              bookingData.eventType === type ? "border-pizzaOrange bg-pizzaOrange/10 text-white" : "border-white/10 text-white/60 hover:border-white/30"
                            }`}
                          >
                            <span className="font-semibold block mb-1">{type}</span>
                            <span className="text-[10px] text-white/40 font-light">Customized Live Setup</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date & City */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold mb-4">Step 2: Event Date & City</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-poppins font-semibold uppercase tracking-wider text-white/70 mb-2">City *</label>
                          <select 
                            value={bookingData.city}
                            onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                            className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                          >
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Vadodara">Vadodara</option>
                            <option value="Nadiad">Nadiad</option>
                            <option value="Anand">Anand</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-poppins font-semibold uppercase tracking-wider text-white/70 mb-2">Event Date *</label>
                          <input 
                            type="date"
                            required
                            value={bookingData.eventDate}
                            onChange={(e) => setBookingData({ ...bookingData, eventDate: e.target.value })}
                            className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Guest Count */}
                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold mb-4">Step 3: Estimated Guest Capacity</h3>
                      <div>
                        <label className="block text-xs font-poppins font-semibold uppercase tracking-wider text-white/70 mb-2">
                          Number of Guests: <span className="text-pizzaOrange font-bold">{bookingData.guestCount}</span>
                        </label>
                        <input 
                          type="range"
                          min="20"
                          max="1000"
                          step="10"
                          value={bookingData.guestCount}
                          onChange={(e) => setBookingData({ ...bookingData, guestCount: parseInt(e.target.value) })}
                          className="w-full accent-pizzaOrange cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-white/40 font-poppins uppercase tracking-widest mt-2">
                          <span>Intimate (20 Guests)</span>
                          <span>Grand Gala (1000+ Guests)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Details */}
                  {bookingStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold mb-4">Step 4: Contact Details</h3>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Your Name *"
                          required
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="tel" 
                            placeholder="Phone Number *"
                            required
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                          />
                          <input 
                            type="email" 
                            placeholder="Email Address *"
                            required
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                          />
                        </div>
                        <textarea
                          placeholder="Special Requests (Optional)"
                          rows="3"
                          value={bookingData.message}
                          onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                          className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {bookingStep === 5 && (
                    <div className="space-y-6">
                      <h3 className="font-playfair text-2xl font-bold mb-4">Step 5: Review Booking Details</h3>
                      <div className="bg-[#111] p-6 border border-white/10 space-y-3 text-sm font-light text-white/80">
                        <p><strong className="text-white">Event Type:</strong> {bookingData.eventType}</p>
                        <p><strong className="text-white">Location:</strong> {bookingData.city}</p>
                        <p><strong className="text-white">Event Date:</strong> {bookingData.eventDate || "Not selected"}</p>
                        <p><strong className="text-white">Guest Count:</strong> {bookingData.guestCount} Guests</p>
                        <p><strong className="text-white">Contact Name:</strong> {bookingData.name}</p>
                        <p><strong className="text-white">Phone / Email:</strong> {bookingData.phone} | {bookingData.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Wizard Navigation Controls */}
                  <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10 font-poppins text-xs uppercase font-semibold">
                    {bookingStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setBookingStep(bookingStep - 1)}
                        className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                    ) : <div></div>}

                    {bookingStep < 5 ? (
                      <button
                        type="button"
                        onClick={() => setBookingStep(bookingStep + 1)}
                        className="px-8 py-3 bg-pizzaOrange text-white hover:bg-pizzaGold transition-colors flex items-center gap-2"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className="px-8 py-4 bg-pizzaOrange text-white hover:bg-pizzaGold transition-colors flex items-center gap-2"
                      >
                        {isSubmittingForm ? "Submitting Inquiry..." : "Confirm & Submit Booking"}
                      </button>
                    )}
                  </div>

                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Video Modal */}
      <AnimatePresence>
        {isPlayingVideo && (
          <div 
            className="fixed inset-0 z-50 bg-pizzaDark/95 flex items-center justify-center p-4"
            onClick={() => setIsPlayingVideo(false)}
          >
            <div className="w-full max-w-4xl bg-black relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setIsPlayingVideo(false)}
                className="absolute -top-12 right-0 text-white hover:text-pizzaOrange flex items-center gap-2 font-poppins text-xs uppercase tracking-wider"
              >
                <span>Close</span>
              </button>
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="Pizza Experience Showreel" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
