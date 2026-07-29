import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper check for custom Firebase config.
  // Fall back to local mock authentication if real Firebase variables are not defined.
  const isMockAuth = () => {
    return !import.meta.env.VITE_FIREBASE_API_KEY;
  };

  useEffect(() => {
    if (isMockAuth()) {
      const mockAdmin = localStorage.getItem("mock_admin_auth");
      if (mockAdmin) {
        setCurrentUser({ email: mockAdmin, role: "admin", name: "Agency Administrator" });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (isMockAuth()) {
      if (email === "admin@therollingdough.in" && password === "admin123") {
        const userObj = { email, role: "admin", name: "Agency Administrator" };
        setCurrentUser(userObj);
        localStorage.setItem("mock_admin_auth", email);
        return userObj;
      } else {
        throw new Error("Invalid Administrator Credentials.");
      }
    }
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isMockAuth()) {
      setCurrentUser(null);
      localStorage.removeItem("mock_admin_auth");
      return;
    }
    return await signOut(auth);
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
