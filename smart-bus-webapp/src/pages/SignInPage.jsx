import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestSignIn, requestPasswordReset } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './SignInPage.css';

const SignInPage = () => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook

  const { login } = useAuth();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    if (isResetPassword) {
      try {
        const response = await requestPasswordReset(username);
        setMessage(response.data.message);
        setError('');
      } catch (err) {
        setError(err.response.data.error);
        setMessage('');
      }
    } else {
      try {
        const response = await requestSignIn(username, password);
        const token = response.data.token;
        login(token);
        navigate('/dashboard'); // Redirect to dashboard after successful sign-in
      } catch (err) {
        setError(err.response.data.error);
      }
    }
  };

  const handleToggleResetPassword = () => {
    setIsResetPassword(!isResetPassword);
  };

  const handleBack = () => {
    setIsResetPassword(false);
    setMessage('');
    setError('');
  };

  return (
    <div className="signin-page">
      {isResetPassword ? <h2>Reset Password</h2> : <h2>Login</h2>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        {isResetPassword ? (
          <>
            <button type="submit">Reset Password</button>
            <button type="button" className="back-btn" onClick={handleBack}>
              Back
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Sign In</button>
            <button type="button" onClick={handleToggleResetPassword}>
              Forgot Password?
            </button>
          </>
        )}
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignInPage;
