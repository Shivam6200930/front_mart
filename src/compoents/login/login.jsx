import React, { useState } from "react";
import styles from './login.module.css'; // Import CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../redux/action/Actions';
import { signInWithGoogle } from './firebase_config';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.login);

  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [changePassword, setChangePassword] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const login = async () => {
    const updatedDetails = {
      ...userDetails,
      email: userDetails.email.toLowerCase()
    };

    if (!updatedDetails.email || !updatedDetails.password) {
      toast.error("Please enter both email and password");
      return;
    }

    dispatch(loginRequest(updatedDetails));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        updatedDetails,
        { withCredentials: true }
      );
      const user = response.data.user;
      if ('mandalshivam962@gmail.com' === user.email) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.success("Login successful");
        navigate("/");
      }
      dispatch(loginSuccess(user));
    } catch (error) {
      toast.error(error.message);
      dispatch(loginFailure(error.message));
    }
    setUserDetails({ email: "", password: "" });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>Login</h1>
        <hr className={styles.divider} />
        <input
          type="text"
          className={styles.inputField}
          name="email"
          value={userDetails.email}
          placeholder="Enter your Email"
          onChange={handleChange}
        />
        <div className={styles.passwordWrapper}>
          <input
            type={changePassword ? "password" : "text"}
            className={styles.inputField}
            name="password"
            value={userDetails.password}
            placeholder="Enter Your Password"
            onChange={handleChange}
          />
          <span
            className={styles.iconlogin}
            onClick={() => setChangePassword(prev => !prev)}
          >
            {changePassword ? <EyeOff /> : <Eye />}
          </span>
        </div>
        <button
          className={styles.loginButton}
          onClick={login}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className={styles.orText}>or</div>
        <a href="/register" className={styles.link}>
          <button className={styles.registerButton}>
            Register
          </button>
        </a>
        <a className={styles.forgetPasswordLink} href="/forgetpassword">
          Forget Password
        </a>
      </div>
      <ToastContainer position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Login;
