import React, { useState } from 'react';
import './Navbar.css'; // Import CSS file
import { useAuth } from '../../contexts/AuthContext'; // Import AuthContext for logout functionality

const Navbar = ({toggleSidebar}) => {
  const { logout } = useAuth(); // Access logout function from AuthContext
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h1>Smart-Bus</h1>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search..." className="search-input" />
        <i className="fas fa-search search-icon"></i>
      </div>
      <div className="navbar-right">
        <button className="messages-btn" onClick={() => setShowMessages(!showMessages)}>
          <i className="fas fa-bell"></i>
        </button>
        {showMessages && (
          <div className="messages-dropdown">
            <p>No new messages</p>
          </div>
        )}
        <div className="profile-dropdown">
          <button className="profile-btn" onClick={() => setShowProfileOptions(!showProfileOptions)}>
            <i className="fas fa-user-circle"></i>
          </button>
          {showProfileOptions && (
            <div className="profile-options">
              <button onClick={handleLogout}>Logout</button>
              <button onClick={() => alert('Settings clicked')}>Settings</button>
              <button onClick={() => alert('Update Profile clicked')}>Update Profile</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
