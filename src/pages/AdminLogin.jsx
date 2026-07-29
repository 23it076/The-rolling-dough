import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to log in as administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pizzaDark flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#1A1A1A] p-8 md:p-10 border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-pizzaOrange/10 rounded-full flex items-center justify-center text-pizzaOrange mx-auto mb-4">
            <Shield size={28} />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-xs text-white/50 font-poppins uppercase tracking-wider">The Rolling Dough Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-poppins flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-poppins font-semibold uppercase tracking-wider text-white/70 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange transition-colors pl-10"
                placeholder="admin@therollingdough.in"
              />
              <Mail size={16} className="absolute left-3 top-3.5 text-white/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-poppins font-semibold uppercase tracking-wider text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-pizzaOrange transition-colors pl-10"
                placeholder="••••••••"
              />
              <Lock size={16} className="absolute left-3 top-3.5 text-white/40" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-pizzaOrange hover:bg-pizzaGold text-white font-poppins font-semibold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/40 font-light">
          <p>Mock Admin Credentials:</p>
          <p className="text-white/60 font-mono mt-1">admin@therollingdough.in / admin123</p>
        </div>
      </div>
    </div>
  );
}
