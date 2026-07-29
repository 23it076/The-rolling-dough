import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// Local storage mocks in case Firebase is not connected or initialized with real keys yet
const getLocalStorageData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setLocalStorageData = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const INITIAL_MENU = [
  { id: "1", name: "Margherita Classica", description: "The timeless Neapolitan classic", ingredients: "San Marzano D.O.P. Tomatoes, Fresh Fior di Latte Mozzarella, Pecorino Romano, EVOO, Fresh Basil", price: "Premium Package", category: "Classic", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80", isPopular: true },
  { id: "2", name: "Diavola di Napoli", description: "Fiery, bold, and full of flavor", ingredients: "San Marzano Tomatoes, Fior di Latte, Premium Italian Spicy Salami, Calabrian Chili flakes, Hot Honey drizzle", price: "Premium Package", category: "Classic", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", isPopular: true },
  { id: "3", name: "Tartufo e Funghi Misti", description: "Earthy, aromatic luxurious truffle cream slice", ingredients: "Black Truffle Cream Base, Sautéed Porcini Mushrooms, Smoked Scamorza, Arugula, White Truffle Oil", price: "Luxury Add-on", category: "Special", image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80", isPopular: true },
  { id: "4", name: "Orto Vesuvio (Veg)", description: "Rich, vibrant assortment of wood-roasted vegetables", ingredients: "San Marzano Tomatoes, Fior di Latte, Grilled Zucchini, Roasted Bell Peppers, Caramelized Onions, Basil Oil", price: "Premium Package", category: "Vegetarian", image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=800&q=80", isPopular: false }
];

const INITIAL_REVIEWS = [
  { id: "1", customerName: "Ananya Mehta", company: "Private Villa Event", review: "The Rolling Dough transformed our anniversary into an authentic Italian piazza! The live spinning was hypnotic and the pizzas tasted exactly like Napoli.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { id: "2", customerName: "Rajesh Patel", company: "Corporate Gala - Vadodara", review: "Outstanding execution. Preparing unlimited wood-fired pizzas live for over 400 guests was impressive. Prompt, clean, and delicious.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
];

const INITIAL_GALLERY = [
  { id: "1", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", title: "Flames in the Stone Oven", category: "Oven" },
  { id: "2", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", title: "Freshly sliced Diavola", category: "Pizza" },
  { id: "3", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80", title: "Chef stretching the dough", category: "Chef" }
];

// Helper to determine if we should fall back to Local Storage (no custom Firebase config provided)
const isFirebaseMock = () => {
  return !import.meta.env.VITE_FIREBASE_API_KEY;
};

// ----------------------------------------------------
// BOOKINGS SERVICE
// ----------------------------------------------------
export const addBooking = async (bookingData) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_bookings", []);
    const newDoc = { id: Date.now().toString(), ...bookingData, status: "pending", createdAt: new Date().toISOString() };
    setLocalStorageData("trd_bookings", [newDoc, ...list]);
    return newDoc;
  }
  return await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "pending",
    createdAt: serverTimestamp()
  });
};

export const getBookings = async () => {
  if (isFirebaseMock()) {
    return getLocalStorageData("trd_bookings", []);
  }
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firebase fetch error, falling back to mock", e);
    return getLocalStorageData("trd_bookings", []);
  }
};

export const updateBookingStatus = async (id, status) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_bookings", []);
    const updated = list.map(b => b.id === id ? { ...b, status } : b);
    setLocalStorageData("trd_bookings", updated);
    return;
  }
  await updateDoc(doc(db, "bookings", id), { status });
};

export const deleteBooking = async (id) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_bookings", []);
    setLocalStorageData("trd_bookings", list.filter(b => b.id !== id));
    return;
  }
  await deleteDoc(doc(db, "bookings", id));
};

// ----------------------------------------------------
// MENU SERVICE
// ----------------------------------------------------
export const getMenu = async () => {
  if (isFirebaseMock()) {
    return getLocalStorageData("trd_menu", INITIAL_MENU);
  }
  try {
    const snap = await getDocs(collection(db, "menu"));
    if (snap.empty) return INITIAL_MENU;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return getLocalStorageData("trd_menu", INITIAL_MENU);
  }
};

export const addMenuItem = async (item) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_menu", INITIAL_MENU);
    const newDoc = { id: Date.now().toString(), ...item };
    setLocalStorageData("trd_menu", [newDoc, ...list]);
    return newDoc;
  }
  return await addDoc(collection(db, "menu"), item);
};

export const deleteMenuItem = async (id) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_menu", INITIAL_MENU);
    setLocalStorageData("trd_menu", list.filter(item => item.id !== id));
    return;
  }
  await deleteDoc(doc(db, "menu", id));
};

// ----------------------------------------------------
// GALLERY SERVICE
// ----------------------------------------------------
export const getGallery = async () => {
  if (isFirebaseMock()) {
    return getLocalStorageData("trd_gallery", INITIAL_GALLERY);
  }
  try {
    const snap = await getDocs(collection(db, "gallery"));
    if (snap.empty) return INITIAL_GALLERY;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return getLocalStorageData("trd_gallery", INITIAL_GALLERY);
  }
};

export const addGalleryItem = async (item) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_gallery", INITIAL_GALLERY);
    const newDoc = { id: Date.now().toString(), ...item, createdAt: new Date().toISOString() };
    setLocalStorageData("trd_gallery", [newDoc, ...list]);
    return newDoc;
  }
  return await addDoc(collection(db, "gallery"), { ...item, createdAt: serverTimestamp() });
};

export const deleteGalleryItem = async (id) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_gallery", INITIAL_GALLERY);
    setLocalStorageData("trd_gallery", list.filter(item => item.id !== id));
    return;
  }
  await deleteDoc(doc(db, "gallery", id));
};

// ----------------------------------------------------
// REVIEWS SERVICE
// ----------------------------------------------------
export const getReviews = async () => {
  if (isFirebaseMock()) {
    return getLocalStorageData("trd_reviews", INITIAL_REVIEWS);
  }
  try {
    const snap = await getDocs(collection(db, "reviews"));
    if (snap.empty) return INITIAL_REVIEWS;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return getLocalStorageData("trd_reviews", INITIAL_REVIEWS);
  }
};

export const addReviewItem = async (review) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_reviews", INITIAL_REVIEWS);
    const newDoc = { id: Date.now().toString(), ...review, createdAt: new Date().toISOString() };
    setLocalStorageData("trd_reviews", [newDoc, ...list]);
    return newDoc;
  }
  return await addDoc(collection(db, "reviews"), { ...review, createdAt: serverTimestamp() });
};

export const deleteReviewItem = async (id) => {
  if (isFirebaseMock()) {
    const list = getLocalStorageData("trd_reviews", INITIAL_REVIEWS);
    setLocalStorageData("trd_reviews", list.filter(r => r.id !== id));
    return;
  }
  await deleteDoc(doc(db, "reviews", id));
};
