import React, { useEffect, useState } from 'react';
import { AuthContext } from '../Context/AutContext';
import useAxios from '../Hooks/UseAxios';

export default function AuthProviders({ children }) {
  const axiosInstance = useAxios();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };
  const authInfo = {
    user,
    loading,
    signIn,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
