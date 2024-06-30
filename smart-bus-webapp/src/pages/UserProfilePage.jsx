// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details from the server
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/user/details'); // Replace '/api/user/details' with your actual backend endpoint
        setUserDetails(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchUserDetails();
  }, []); // Empty dependency array ensures the effect runs only once

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {userDetails.username}</p>
      <p>Department: {userDetails.department}</p>
      <p>Role: {userDetails.role}</p>
      {/* Display other user details as needed */}
    </div>
  );
};

export default UserProfilePage;
