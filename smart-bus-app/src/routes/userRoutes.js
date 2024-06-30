// userRoutes.js
const express = require('express');
const router = express.Router();
const { insertEntity, updateEntity, partialUpdateEntity, deleteAllEntities, getAllEntities, deleteEntityById,searchUser } = require('../mongoose/database/middleware');
const User = require('../mongoose/model/user');
const utility = require('../utility');
const path = require('path');

const logFilePath='user-routes.log';
// = path.join(__dirname, 'logs', 'user-routes.log');

// Middleware to log requests
router.use((req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(logMessage);
  utility.logToFile(logMessage, logFilePath);
  next();
});

// Get all users
router.get('/users-list', async (req, res) => {
  try {
    const users = await getAllEntities(User);
    res.status(200).json(users);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});


router.get('/search', async (req, res) => {
  const { username, email } = req.query;
  try {
    let query = {};
    if (username) {
      query.username = username;
    } else if (email) {
      query.email = email;
    } else {
      return res.status(400).json({ error: "Username or email parameter is required" });
    }
    const user=await searchUser(User,query);
    // const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    utility.logToFile(`searched for user: ${user}`, logFilePath);
    res.status(200).json(user);

  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  let userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Create a new user
router.post('/register', async (req, res) => {
  try {
    console.log("REQ:", req.body)
    const newUser = await insertEntity(User, req.body);
    res.status(201).json({ message: "User Created Successfully !", newUser });
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    const payload = req.body;
    const updatedUser = await updateEntity(User, userId, payload);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Partially update a user
router.patch('/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    const payload = req.body;
    const updatedUser = await partialUpdateEntity(User, userId, payload);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    const deletedUser = await deleteEntityById(User, userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User Deleted Successfully !" });
  } catch (err) {
    console.error("ERROR :", err.message);
    utility.logToFile(`ERROR: ${err.message}`, logFilePath);
    res.status(500).json({ error: "Internal Server error" });
  }
});





// // Sign In Route
// router.post('/signin', async (req, res) => {
//   try {
//     const { email, password } = req.body;
 
//     const user=await searchUser(User,email);
//     // const user = await User.findOne(query);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     utility.logToFile(`searched for user: ${user}`, logFilePath);
   
//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // utility.logToFile(`searched for user: ${user}`, logFilePath);
   
//     // Authentication successful
//     res.status(200).json({ message: 'Authentication successful', user });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


module.exports = router;
