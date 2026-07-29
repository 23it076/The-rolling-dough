import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { SkeletonLoader } from "./components/common/MicroInteractions";

// Code splitting with Lazy Loading & Suspense
const Home = lazy(() => import("./pages/Home"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-pizzaDark flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="w-12 h-12 border-4 border-pizzaOrange border-t-transparent rounded-full animate-spin mb-4" />
      <span className="font-poppins text-xs uppercase tracking-widest text-pizzaGold">Loading Neapolitan Pizzeria...</span>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
