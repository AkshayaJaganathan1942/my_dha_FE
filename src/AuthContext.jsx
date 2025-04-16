import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null; // Initialize with saved user or null
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("currentUser", JSON.stringify(auth));
    } else {
      localStorage.removeItem("currentUser"); // Clear storage on logout
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);