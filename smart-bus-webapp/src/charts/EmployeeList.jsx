import React, { useState, useEffect,useCallback } from 'react';
import './Employee.css';

const EmployeeList = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [filters, setFilters] = useState({
    active: true,
    inactive: true,
    male: true,
    female: true,
    other: true,
  });

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // const filterEmployees = () => {
  //   // const filtered = employees.filter(employee =>
  //   //   employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   //   filters[employee.gender.toLowerCase()] &&
  //   //   filters[employee.isActive ? 'active' : 'inactive']
  //   // );
  //   // setFilteredEmployees(filtered);
  // };
 
  const filterEmployees = useCallback(() => {
    if (!employees || employees.length === 0) {
      setFilteredEmployees([]);
      return;
    }

    const dynamicFilter = (employee, filters) => {
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          const filterValue = filters[key];
          const employeeValue = employee[key];

          if (employeeValue === undefined || employeeValue === null) {
            return false;
          }

          if (typeof filterValue === 'string') {
            if (!employeeValue.toLowerCase().includes(filterValue.toLowerCase())) {
              return false;
            }
          } else if (typeof filterValue === 'boolean') {
            if (filterValue !== (employeeValue ? 'active' : 'inactive')) {
              return false;
            }
          }
        }
      }
      return true;
    };

    const filtered = employees.filter(employee => dynamicFilter(employee, filters));
    setFilteredEmployees(filtered);
  }, [employees, filters]);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees]);

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleFilterChange = (filterKey) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  return (
    <div className="employee-list">
      <div className="filter-button" onClick={toggleFilterModal}>
        <i className="fas fa-filter"></i> Filter
      </div>
      {showFilterModal && (
        <div className="filter-modal">
          <h3>Filters</h3>
          <label>
            <input
              type="checkbox"
              checked={filters.active}
              onChange={() => handleFilterChange('active')}
            />
            Active
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.inactive}
              onChange={() => handleFilterChange('inactive')}
            />
            Inactive
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.male}
              onChange={() => handleFilterChange('male')}
            />
            Male
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.female}
              onChange={() => handleFilterChange('female')}
            />
            Female
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.other}
              onChange={() => handleFilterChange('other')}
            />
            Other
          </label>
          <button onClick={toggleFilterModal}>Close</button>
        </div>
      )}
      <input
        type="text"
        placeholder="Search employee..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Date of Birth</th>
            <th>Date of Joining</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.employeeId}>
              <td>{employee.employeeId}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.contact}</td>
              <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
              <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
