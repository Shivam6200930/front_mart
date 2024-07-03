// src/components/login/login.jsx
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
  const temp= useSelector(state =>console.log(state.login.user))

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    loggedIn:false
  });
  const [changePassword, setChangePassword] = useState(true);
  const changeIcon = changePassword === true ? false : true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const login = async () => {
    userDetails.email = userDetails.email.toLowerCase();
    dispatch(loginRequest(userDetails));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userDetails,
        { withCredentials: true }
      );
      const user = response.data.user;
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
      console.log(error);
    }
    setUserDetails({
      email: "",
      password: "",
      loggedIn:true
    });
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      console.log(user);
      const token = await user.getIdToken();
      console.log(`token:${token}`)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`,
        { token },
        { withCredentials: true }
      );
        localStorage.setItem('role',JSON.stringify(response.data.user.role));
      if ('mandalshivam962@gmail.com' === user.email) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.success("Login successfully");
        navigate("/");
      }
      dispatch(loginSuccess(user));
    } catch (error) {
     alert(error.message);
      dispatch(loginFailure(error.message));
      console.error(error);
    }
  };

  return (
    <>
      <div className="Login-container">
        <div className="login">
          <h1>Login</h1>
          <hr></hr>
          <input
            type="text"
            className="input"
            name="email"
            value={userDetails.email}
            placeholder="Enter your Email"
            onChange={handleChange}
          ></input>
          <input
            type={changePassword ? "password" : "text"}
            className="input"
            name="password"
            value={userDetails.password}
            placeholder="Enter Your Password"
            onChange={handleChange}
          ></input>
          <span id="icon"
            onClick={() => {
              setChangePassword(changeIcon);
            }}
          >
            {changeIcon ? <Eye /> : <EyeOff />}
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
