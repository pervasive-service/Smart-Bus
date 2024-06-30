import React from 'react';
import EmployeeCharts from '../charts/EmployeeCharts';
import BusCharts from '../charts/BusCharts';
import './Dashboard.css';

const generateRandomData = () => {
  return {
    employeeData: {
      active: Math.floor(Math.random() * 100),
      inactive: Math.floor(Math.random() * 100),
      allocated: Math.floor(Math.random() * 100),
      planned: Math.floor(Math.random() * 100),
      onleave: Math.floor(Math.random() * 100),
      details: {
        department: 'Engineering',
        location: 'Head Office',
        manager: 'John Doe',
      }
    },
    busData: {
      active: Math.floor(Math.random() * 100),
      inactive: Math.floor(Math.random() * 100),
      planned: Math.floor(Math.random() * 100),
      details: {
        depot: 'Central Depot',
        maintenanceManager: 'Jane Smith',
      }
    },
  };
};

const Dashboard = () => {
  const { employeeData, busData } = generateRandomData();

  return (
    <div className="container">
    <div className="row">
      <div className="col">
        <h2>Employee Data</h2>
        {/* <EmployeeCharts data={employeeData} /> */}
        <EmployeeCharts
          occupied={employeeData.active}
          unoccupied={employeeData.inactive}
          allocated={employeeData.allocated}
          planned={employeeData.planned}
          leave ={employeeData.onleave}
        />

        <div className="details">
          <h3>Details</h3>
          <p>Department: {employeeData.details.department}</p>
          <p>Location: {employeeData.details.location}</p>
          <p>Manager: {employeeData.details.manager}</p>
        </div>
      </div>
      <div className="col">
        <h2>Bus Data</h2>
        {/* <BusCharts data={busData} /> */}
        <BusCharts
          occupied={busData.active}
          unoccupied={busData.active}
          planned={busData.planned}
          maintenance={busData.inactive}
        />
        <div className="details">
          <h3>Details</h3>
          <p>Depot: {busData.details.depot}</p>
          <p>Maintenance Manager: {busData.details.maintenanceManager}</p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
