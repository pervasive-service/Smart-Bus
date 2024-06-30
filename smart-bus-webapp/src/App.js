// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer'; // Import Footer component
import AppRoutes from './Router';

const AppContent = ({ isSidebarOpen, toggleSidebar }) => {

  const location = useLocation();
  const isAuthRoute = location.pathname === '/login';

  return (
    <div className="app">
      {!isAuthRoute && <Navbar toggleSidebar={toggleSidebar} />}
      {!isAuthRoute && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <main className="content">
        <AppRoutes />
      </main>
      {!isAuthRoute&&  <Footer /> } {/* Include the Footer component here */}
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <AppContent isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </Router>
  );
};


export default App;
