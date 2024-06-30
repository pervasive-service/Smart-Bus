import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
     <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <hr></hr>
      <ul>
        <li><a href="/home">Home</a></li>
        {/* <li><a href="/dashboard">Dashboard</a></li> */}
        {/* <li><a href="/settings">Settings</a></li> */}
        <li className="sub-menu">Trips Management
          <ul>
            <li><a href="/fleet-management">Fleet Overview</a></li>
          </ul>
        </li>
        <li className="sub-menu">Information Management
          <ul>
            <li><a href="/employees">Employee Management</a></li>
            <li><a href="/vehicles">Bus Management</a></li>
            <li><a href="/schedules">Schedule Management</a></li>
            
            {/* <li><a href="/remove-employee">Remove Employee</a></li> */}

          </ul>
        </li>
        {/* <li><a href="/schedules">Schedules</a></li>
        <li><a href="/trips">Trips</a></li> */}
        <li><a href="/bulk-inventory">Bulk upload</a></li>
      </ul>
      
    </aside>
  );
};

export default Sidebar;
