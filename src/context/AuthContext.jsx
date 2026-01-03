import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('globetrotter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // For now, accept any email/password
    const userData = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('globetrotter_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = (formData) => {
    // For now, accept any registration
    const userData = {
      id: Date.now(),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      city: formData.city,
      country: formData.country,
      additionalInfo: formData.additionalInfo,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('globetrotter_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('globetrotter_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
