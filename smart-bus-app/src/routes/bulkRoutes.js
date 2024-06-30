// userRoutes.js
const express = require('express');
const router = express.Router();
const { insertEntity, insertEntities,updateEntity, partialUpdateEntity, deleteAllEntities, getAllEntities, deleteEntityById,searchUser } = require('../mongoose/database/middleware');
const mongoose = require('mongoose');

const models = mongoose.connection.models;
const Employee = require('../mongoose/model/employee');

const utility = require('../utility');
const path = require('path');

const logFilePath='bulk-routes.log';
// = path.join(__dirname, 'logs', 'user-routes.log');

// Middleware to log requests
router.use((req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(logMessage);
  utility.logToFile(logMessage, logFilePath);
  next();
});

// Get all users
router.get('/get-templates', async (req, res) => {
    try {
      const templates = {};
      for (let modelName in models) {
        const model = models[modelName];
        
        // Generate template for the model
        // const template = utility.generateTemplateFromModel(model);
        
        // Fetch one row of dummy data from the database
        // const template = await model.findOne();
        const template= await model.findOne({}, { __v: 0, _id: 0, createdAt: 0, updatedAt: 0,password: 0});
      
        
        // Include the dummy data in the template
        templates[modelName] = { template };
      }
      res.status(200).json(templates);
    } catch (err) {
      console.error("ERROR :", err.message);
      utility.logToFile(`ERROR: ${err.message}`, logFilePath);
      res.status(500).json({ error: "Internal Server error" });
    }
  });

  
  router.post('/:record/bulk-add', async (req, res) => {
    try {
        const recordBody = req.body;
        let recordValue = req.params.record;

        // Check if the record parameter matches any of the models
        // const model = models[recordValue];
        recordValue = recordValue.charAt(0).toUpperCase() + recordValue.slice(1).toLowerCase();

        // Retrieve the model based on the recordValue
        // const model = mongoose.connection.models[recordValue];
        const model = models[recordValue];

        if (!model) {
            return res.status(400).json({ error: 'Invalid record parameter' });
        }

        const batchSize = 1000; // Adjust batch size as needed
        const totalRecords = recordBody.length;
        let insertedCount = 0;
        let erroredCount = 0;
        let insertedRecords = [];
        let errors = [];

        // Insert records in batches
        for (let i = 0; i < totalRecords; i += batchSize) {
            const batch = recordBody.slice(i, i + batchSize);
            try {
                const insertedBatch = await insertEntities(model, batch);
                insertedRecords = insertedRecords.concat(insertedBatch);
                insertedCount += insertedBatch.length;
            } catch (err) {
                console.error("Error inserting batch:", err.message);
                erroredCount += batch.length;
                errors.push({ error: err.message, batch });
            }
        }

        res.status(201).json({
            message: "Bulk Insertion Completed",
            insertedCount,
            erroredCount,
            insertedRecords,
            errors
        });
    } catch (err) {
        console.error("ERROR:", err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
});


// const { validationErrors, validCount } = utility.validateJSONData(EntityModel, jsonData);
// console.log('Validation Errors:', validationErrors);
// console.log('Valid Count:', validCount);

// router.get('/search', async (req, res) => {
//   const { username, email } = req.query;
//   try {
//     let query = {};
//     if (username) {
//       query.username = username;
//     } else if (email) {
//       query.email = email;
//     } else {
//       return res.status(400).json({ error: "Username or email parameter is required" });
//     }
//     const user=await searchUser(User,query);
//     // const user = await User.findOne(query);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     utility.logToFile(`searched for user: ${user}`, logFilePath);
//     res.status(200).json(user);

//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });

// // Get user by ID
// router.get('/:id', async (req, res) => {
//   let userId = req.params.id;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });

// Create a new user
// router.post('/register', async (req, res) => {
//   try {
//     console.log("REQ:", req.body)
//     const newUser = await insertEntity(User, req.body);
//     res.status(201).json({ message: "User Created Successfully !", newUser });
//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });

// Update a user
// router.put('/:id', async (req, res) => {
//   try {
//     let userId = req.params.id;
//     const payload = req.body;
//     const updatedUser = await updateEntity(User, userId, payload);
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });

// // Partially update a user
// router.patch('/:id', async (req, res) => {
//   try {
//     let userId = req.params.id;
//     const payload = req.body;
//     const updatedUser = await partialUpdateEntity(User, userId, payload);
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });

// // Delete a user
// router.delete('/:id', async (req, res) => {
//   try {
//     let userId = req.params.id;
//     const deletedUser = await deleteEntityById(User, userId);
//     if (!deletedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json({ message: "User Deleted Successfully !" });
//   } catch (err) {
//     console.error("ERROR :", err.message);
//     utility.logToFile(`ERROR: ${err.message}`, logFilePath);
//     res.status(500).json({ error: "Internal Server error" });
//   }
// });


module.exports = router;
