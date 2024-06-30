// app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const utility = require('./utility');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // New authentication routes
const employeeRoutes = require('./routes/employeeRoutes');
const bulkRoutes = require('./routes/bulkRoutes');
const cors = require('cors');

const config = require('../config/config.json');
const bodyParser = require('body-parser');
const uploadLimitString=config.server.uploadLimit;

const fs = require('fs'); 
const app = express();

const { connect } = require('./mongoose/database/db');
connect(); // Call the connect function to establish MongoDB connection








console.log(uploadLimitString)
 // Example dynamic value (in MB)
const uploadLimit = parseInt(uploadLimitString);

// Check if the parsed value is valid
if (!isNaN(uploadLimit)) {
  // Set the upload limit for JSON payloads
  app.use(bodyParser.json({ limit: uploadLimit + 'mb' }));
} else {
  console.error("Invalid upload limit value:", uploadLimitString);
  // Handle invalid upload limit value
}




// Logger middleware
const logFilePath= path.join(__dirname, '../logs', 'app.log');


app.use(cors());

app.use(morgan('combined', {
  stream: fs.createWriteStream(logFilePath, { flags: 'a' })
}));

// JSON parser middleware
app.use(express.json());

// Serve static files from the public folder
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// Routes
app.use('/bulk',bulkRoutes);
app.use('/employee',employeeRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error("ERROR :", err.message);
  utility.logToFile(`ERROR: ${err.message}`, logFilePath);
  res.status(500).json({ error: "Internal Server error" });
});

module.exports = app;
