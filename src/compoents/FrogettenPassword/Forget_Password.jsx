import React from 'react';
import styles from './forget_password.module.css'; // Import the module CSS
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgetPassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const forget = async () => {
    try {
      if (!user.email) {
        toast.warn('Please enter your email!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/sendresetPassword`,
          {
            email: user.email
          },
          { withCredentials: true }
        );
        toast.success('Mail sent successfully! Check your inbox within 10 minutes.');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again later.');
    }
    setUser({
      email: ''
    });
  };

  return (
    <>
      <div className={styles["forget-container"]}>
        <div className={styles["forget-card"]}>
          <h2>Reset Password</h2>
          <p>Enter your registered email address to reset your password.</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            className={styles["input-field"]}
          />
          <button onClick={forget} className={styles["btn-reset"]}>
            Submit
          </button>
        </div>
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default ForgetPassword;
