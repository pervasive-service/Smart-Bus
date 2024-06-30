import React, { useState } from 'react';
import './Bus.css';

const BusList = ({ buses }) => {
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBuses = buses.filter(bus =>
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (bus.number.includes(filter) || filter === '') &&
    (bus.status.includes(filter) || filter === '')
  );

  return (
    <div className="bus-list">
      <input
        type="text"
        placeholder="Search by route..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <select value={filter} onChange={handleFilterChange}>
        <option value="">Filter by status</option>
        <option value="occupied">Occupied</option>
        <option value="unoccupied">Unoccupied</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Bus Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuses.map(bus => (
            <tr key={bus.id}>
              <td>{bus.route}</td>
              <td>{bus.number}</td>
              <td>{bus.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusList;
