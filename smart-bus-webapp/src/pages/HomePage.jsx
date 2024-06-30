import React, { useState, useEffect } from 'react';
// import EmployeeCharts from '../charts/EmployeeCharts';
// import BusCharts from '../charts/BusCharts';
import EmployeeList from '../charts/EmployeeList';
import BusList from '../charts/BusList';
import './HomePage.css'; // Import CSS file
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [buses, setBuses] = useState([]);
  const context = useAuth();
 
  useEffect(() => {
    const cachedEmployees = localStorage.getItem('cachedEmployees');
    if (cachedEmployees) {
      setEmployees(JSON.parse(cachedEmployees));
    } else {
      fetchEmployeeData();
    }

    const timer = setInterval(fetchEmployeeData, 60000); // Fetch every minute

    return () => clearInterval(timer);
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const headers = {};
      if (context.authToken) {
        headers['Authorization'] = `Bearer ${context.authToken}`;
      }

      const response = await fetch('http://localhost:8080/employee/employees-list', { headers });
      const data = await response.json();
      setEmployees(data);
      localStorage.setItem('cachedEmployees', JSON.stringify(data)); // Cache the data in local storage
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  return (
    <div className="home-page">
      <div className='container'>
        <div className="row">
          {/* <EmployeeCharts {...employeeData} /> */}
          {/* <BusCharts {...busData} /> */}
        </div>
        <div className='row'>
          <EmployeeList employees={employees} />
          <BusList buses={buses} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
