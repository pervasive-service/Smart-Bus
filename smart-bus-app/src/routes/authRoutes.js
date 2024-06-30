const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { insertEntity, searchUser } = require('../mongoose/database/middleware');
const User = require('../mongoose/model/user');
const utility = require('../utility');
const config=require("../../config/config.json");
const jwt = require('jsonwebtoken');


// const path = require('path');

const logFilePath = 'auth-routes.log';

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input data
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }
    // You can add more validation rules here

    // Check if the user already exists
    const existingUser = await searchUser(User, { email: email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await insertEntity(User, { username, email, password: hashedPassword });

    // Generate JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, config.secretKey, { expiresIn: '1h' });

    // Send the token in the response
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('ERROR:', error.message);
    utility.logToFile(`ERROR: ${error.message}`, logFilePath);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Sign In Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by email
    const user = await searchUser(User,{username:username});
   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, config.secretKey, { expiresIn: '1h' }); // Adjust expiration as needed
    // Send token in response
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('ERROR:', error.message);
    utility.logToFile(`ERROR: ${error.message}`, logFilePath);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await searchUser(User, { email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a new password
    const newPassword = utility.generateRandomPassword(); // Implement your function to generate a random password

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save(); // Save the user with the new password

    // Send password reset email with the new password
    const options = {
      transport: config.emailConfig, // Use the email configuration from the config file
      from: config.emailConfig.auth.user, // Use the sender email from the config
      to: email,
      subject: 'Password Reset',
      text: `Your password has been reset successfully.\n\n`
        + `Your new password is: ${newPassword}\n\n`
        + `Please login using this new password and consider changing it immediately.\n`
    };

    // Send the email
    const result = await utility.sendMail(options); // Assuming sendMail is properly configured

    if (result.success) {
      utility.logToFile(`Password reset email sent to: ${email}`, logFilePath);
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } else {
      utility.logToFile(`Failed to send password reset email to: ${email}`, logFilePath);
      res.status(500).json({ error: 'Failed to send password reset email' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    utility.logToFile(`Error resetting password: ${error}`, logFilePath);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
