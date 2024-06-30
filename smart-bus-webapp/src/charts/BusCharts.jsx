import React from 'react';
import './Bus.css';

const BusCharts = ({ occupied, unoccupied, planned, maintenance }) => {
  // Calculate percentages
  const total = occupied + unoccupied + planned + maintenance;
//   const occupiedPercent = (occupied / total) * 100;
//   const unoccupiedPercent = (unoccupied / total) * 100;
//   const plannedPercent = (planned / total) * 100;
//   const maintenancePercent = (maintenance / total) * 100;

  return (
    <div className="bus-stat">
      <h2>Bus Charts</h2>
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
          <h3>{maintenance}</h3>
          <p>Maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default BusCharts;
