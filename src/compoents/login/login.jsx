import React, { useState } from "react";
import './login.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../redux/action/Actions';
import { signInWithGoogle } from './firebase_config'; // Import the signInWithGoogle function

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector(state => state.login);

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
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

    // Basic validation to check if fields are empty
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
      console.log(error);
    }
    setUserDetails({
      email: "",
      password: ""
    });
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`,
        { token },
        { withCredentials: true }
      );
      localStorage.setItem('role', JSON.stringify(response.data.user.role));
      if ('mandalshivam962@gmail.com' === user.email) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.success("Login successfully");
        navigate("/");
      }
      dispatch(loginSuccess(user));
    } catch (error) {
      toast.error(error.message);
      dispatch(loginFailure(error.message));
      console.error(error);
    }
  };

  return (
    <>
      <div className="Login-container">
        <div className="login">
          <h1>Login</h1>
          <hr />
          <input
            type="text"
            className="input"
            name="email"
            value={userDetails.email}
            placeholder="Enter your Email"
            onChange={handleChange}
          />
          <input
            type={changePassword ? "password" : "text"}
            className="input"
            name="password"
            value={userDetails.password}
            placeholder="Enter Your Password"
            onChange={handleChange}
          />
          <span id="icon"
            onClick={() => {
              setChangePassword(prev => !prev);
            }}
          >
            {changePassword ? <EyeOff /> : <Eye />}
          </span>

          <button id="button-l" onClick={login} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* <button id="button-l" onClick={loginWithGoogle} disabled={loading}>
            {loading ? 'Logging in...' : 'Login with Google'}
          </button> */}
          
          <div className="or-l">or</div>
          <a href="/register">
            <button id="button-l">
              Register
            </button>
          </a>
          <a id="forget-l" href="/forgetpassword">Forget Password</a>
        </div>
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Login;
