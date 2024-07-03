import React, { useState } from 'react';
import {  useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ResetPasswordPage = () => {
  const navigate=useNavigate()
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/resetPassword/${id}/${token}`, {
        password,
        password_confirm: passwordConfirm,
      },{withCredentials:true});

      alert(response.data.message);
       navigate("/login")
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
        console.log(error)
      } else {
        alert('An error occurred',);
        console.log(error)
      }
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      
    </div>
  );
};



export default ResetPasswordPage;
