
const express = require('express');
const router = express.Router();
const { insertEntity, insertEntities, updateEntity, partialUpdateEntity, deleteAllEntities, getAllEntities, deleteEntityById, searchEmployee } = require('../mongoose/database/middleware');
const Employee = require('../mongoose/model/employee');
const utility = require('../utility');
const path = require('path');
const fs = require('fs');

// const logFilePath = path.join(__dirname, '..', '..', 'logs', 'employee-routes.log');
const logFilePath='employee-routes.log';
// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Middleware to log requests
router.use((req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(logMessage);
  utility.logToFile(logMessage, logFilePath);
  next();
});

// Get all Employees
router.get('/employees-list', async (req, res) => {
    try {
      
      const employees = await getAllEntities(Employee);
      res.status(200).json(employees);
    } catch (err) {
      console.error("ERROR :", err.message);
      utility.logToFile(`ERROR: ${err.message}`, logFilePath);
      res.status(500).json({ error: "Internal Server error" });
    }
  });

// Search Employee
router.get('/search', async (req, res) => {
  const { employeeId, email } = req.query;
  try {
    let query = {};
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (email) {
      query.email = email;
    } else {
      return res.status(400).json({ error: "employeeId or email parameter is required" });
    }
    const employee = await searchEmployee(Employee, query);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    utility.logToFile(`searched for Employee: ${employee}`, logFilePath);
    res.status(200).json(employee);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Get Employee by ID
router.get('/:id', async (req, res) => {
  let employeeId = req.params.id;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Create multiple employees
router.post('/bulk-add', async (req, res) => {
  try {
    const employees = req.body; // Array of employee objects
    const batchSize = 1000; // Adjust batch size as needed
    const totalEmployees = employees.length;
    let insertedCount = 0;
    let erroredCount = 0;
    let insertedEmployees = [];
    let errors = [];
    
    // Insert employees in batches
    for (let i = 0; i < totalEmployees; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      try {
        const insertedBatch = await insertEntities(Employee, batch);
        insertedEmployees = insertedEmployees.concat(insertedBatch);
        insertedCount += insertedBatch.length;
      } catch (err) {
        console.error("Error inserting batch:", err.message);
        utility.logToFile(`Error inserting batch: ${err.message}`, logFilePath);
        erroredCount += batch.length;
        errors.push({ error: err.message, batch });
      }
    }
    
    res.status(201).json({ 
      message: "Bulk Insertion Completed",
      insertedCount,
      erroredCount,
      insertedEmployees,
      errors
    });
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Create a new Employee
router.post('/register', async (req, res) => {
  try {
    console.log("REQ:", req.body)
    const newEmployee = await insertEntity(Employee, req.body);
    res.status(201).json({ message: "Employee Created Successfully !", newEmployee });
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Update a Employee
router.put('/:id', async (req, res) => {
  try {
    let employeeId = req.params.id;
    const payload = req.body;
    const updatedEmployee = await updateEntity(Employee, employeeId, payload);
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Partially update a Employee
router.patch('/:id', async (req, res) => {
  try {
    let employeeId = req.params.id;
    const payload = req.body;
    const updatedEmployee = await partialUpdateEntity(Employee, employeeId, payload);
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Delete a Employee
router.delete('/:id', async (req, res) => {
  try {
    let employeeId = req.params.id;
    const deletedEmployee = await deleteEntityById(Employee, employeeId);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee Deleted Successfully !" });
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports = router;
