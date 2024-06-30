// EmployeeCharts.jsx
import React from 'react';
import './Employee.css'

const EmployeeCharts = ({ occupied, unoccupied, planned, leave }) => {
  // Calculate percentages
  const total = occupied + unoccupied + planned + leave;
//   const occupiedPercent = (occupied / total) * 100;
//   const unoccupiedPercent = (unoccupied / total) * 100;
//   const plannedPercent = (planned / total) * 100;
//   const maintenancePercent = (maintenance / total) * 100;

  return (
    <div className="employee-stat">
      <h2>Employee Charts</h2>
      <div className="grid">
        <div className="card" >
          <h3>{occupied}</h3>
          <p>Occupied</p>
        </div>
        <div className="card" >
          <h3>{unoccupied}</h3>
          <p>Unoccupied</p>
        </div>
        <div className="card" >
          <h3>{planned}</h3>
          <p>Planned</p>
        </div>
        <div className="card" >
          <h3>{leave}</h3>
          <p>On Leave</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCharts;
