// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentPage, setCurrentPage] = useState('login');
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const API_BASE = 'http://localhost:3000/api';

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // ✅ SHOULD CALL AN AUTH USER ENDPOINT
//   const checkAuthStatus = async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/user`, {
//         withCredentials: true,
//       });
//       if (response.data && response.data._id) {
//         setUser(response.data);
//         setIsAuthenticated(true);
//         setCurrentPage('dashboard');
//       } else {
//         setIsAuthenticated(false);
//         setCurrentPage('login');
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//       setIsAuthenticated(false);
//       setCurrentPage('login');
//     }
//   };

//   // ✅ FIXED - use axios here
//   const login = async (emailId, password) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/login`,
//         { emailId, password },
//         { withCredentials: true }
//       );

//       const user = response.data.user;
//       setUser(user);
//       setIsAuthenticated(true);
//       setCurrentPage('dashboard');
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Login failed',
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (formData) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_BASE}/signup`, formData, {
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         return {
//           success: true,
//           message: 'Account created successfully! Please login.',
//         };
//       } else {
//         return {
//           success: false,
//           message: response.data?.message || 'Signup failed',
//         };
//       }
//     } catch (error) {
//       return { success: false, message: 'Network error. Please try again.' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
//     } catch (error) {
//       console.error('Error during logout:', error);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//       setCurrentPage('login');
//       setSelectedBlog(null);
//     }
//   };


//   const value = {
//     user,
//     isAuthenticated,
//     currentPage,
//     setCurrentPage,
//     selectedBlog,
//     setSelectedBlog,
//     loading,
//     setLoading,
//     API_BASE,
//     login,
//     signup,
//     logout,
//     checkAuthStatus,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };




















import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user`, { withCredentials: true });
      if (res.data && res.data._id) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const login = async (emailId, password) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, { emailId, password }, { withCredentials: true });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/signup`, formData, { withCredentials: true });
      return {
        success: true,
        message: 'Account created successfully!',
      };
    } catch (error) {
      return { success: false, message: 'Signup failed' };
    }
  };

  const logout = async () => {
    await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
    setSelectedBlog(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
    setUser, // ✅ needed
    isAuthenticated,
    setIsAuthenticated, // ✅ needed
    selectedBlog,
    setSelectedBlog,
    loading,
    setLoading,
    API_BASE,
    login,
    signup,
    logout,
    checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
