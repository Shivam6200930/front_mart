import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { userId, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [resetStatus, setResetStatus] = useState('');

  useEffect(() => {
    axios.post(`http://127.0.0.1:3000/api/users/validate-token`, { userId, token })
      .then(response => {
        if (response.status === 200) {
          setResetStatus('valid');
        }
      })
      .catch(error => {
        setResetStatus('invalid');
      });
  }, [userId, token]);

  const handleResetPassword = () => {
    axios.post(`https://backend-shivammart.vercel.app/api/users/resetPassword/${userId}/${token}`, { password: newPassword })
      .then(response => {
        if (response.status === 200) {
          setResetStatus('success');
        }
      })
      .catch(error => {
        setResetStatus('error');
      });
  };

  return (
    <div>
      {resetStatus === 'valid' && (
        <div>
          <h2>Reset Your Password</h2>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      {resetStatus === 'invalid' && (
        <div>
          <p>Invalid or expired reset link. Please try again.</p>
        </div>
      )}
      {resetStatus === 'success' && (
        <div>
          <p>Password reset successfully. You can now log in with your new password.</p>
        </div>
      )}
      {resetStatus === 'error' && (
        <div>
          <p>An error occurred. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
