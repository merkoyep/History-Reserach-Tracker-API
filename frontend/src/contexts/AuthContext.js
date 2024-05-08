import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-auth', {
          credentials: 'include', // Ensures cookies are sent with the request
        });
        if (!response.ok) {
          throw new Error('Failed to fetch auth status');
        }
        const data = await response.json(); // Correctly parsing the JSON response
        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          setUser(null);
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch((error) => console.error('Error logging out', error));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
