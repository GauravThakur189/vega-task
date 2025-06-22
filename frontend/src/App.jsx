// // import React, { useState, useEffect } from 'react';
// // import Login from './components/Login';
// // import Signup from './components/Signup';
// // import Dashboard from './components/Dashboard';
// // import BlogView from './components/BlogView';
// // import { AuthProvider, useAuth } from './context/AuthContext';
// // import './App.css';

// // const App = () => {
// //   return (
// //     <AuthProvider>
// //       <div className="App">
// //         <AppContent />
// //       </div>
// //     </AuthProvider>
// //   );
// // };

// // const AppContent = () => {
// //   const { user, isAuthenticated, currentPage } = useAuth();

// //   const renderPage = () => {
// //     switch (currentPage) {
// //       case 'signup':
// //         return <Signup />;
// //       case 'login':
// //         return <Login />;
// //       case 'dashboard':
// //         return <Dashboard />;
// //       case 'blog-view':
// //         return <BlogView />;
// //       default:
// //         return isAuthenticated ? <Dashboard /> : <Login />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {renderPage()}
// //     </div>
// //   );
// // };

// // export default App;





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import BlogView from './components/BlogView';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import './App.css';
// import BlogForm from './components/BlogForm';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/" />;
// };

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" /> : children;
// };
// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
//           <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//           <Route path="/blog/:id" element={<PrivateRoute><BlogView /></PrivateRoute>} />
//           <Route path="/create" element={<PrivateRoute><BlogForm /></PrivateRoute>} />

          
//           {/* fallback route */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;










// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import BlogView from './components/BlogView';
// import BlogForm from './components/BlogForm';

// const App = () => (
//   <AuthProvider>
//     <Router>
//       <Routes>
//         <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
//         <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//         <Route path="/view" element={<PrivateRoute><BlogView /></PrivateRoute>} />
//         <Route path="/create" element={<PrivateRoute><BlogForm /></PrivateRoute>} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   </AuthProvider>
// );

// export default App;

// // Protect private routes
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/" />;
// };

// // Prevent showing login/signup if already logged in
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return !isAuthenticated ? children : <Navigate to="/dashboard" />;
// };



// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import BlogView from './components/BlogView';
import BlogForm from './components/BlogForm';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
        <Route path="/view/:id" element={<AuthWrapper><BlogView /></AuthWrapper>} />
        <Route path="/create" element={<AuthWrapper><BlogForm /></AuthWrapper>} />
        <Route path="/edit/:id" element={<AuthWrapper><BlogForm /></AuthWrapper>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

// ✅ This component protects routes
const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
