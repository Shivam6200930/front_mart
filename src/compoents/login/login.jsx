import React, { useState } from "react";
import './login.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [changePassword, setChangePassword] = useState(true);
  const changeIcon = changePassword === true ? false : true;

  const HandaleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const logins = () => {
        user.email=user.email.toLowerCase()
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, user,{withCredentials: true})
      .then(function (response) {
        console.log(response)
        if('mandalshivam962@gmail.com' === response.data.user.email) {
          toast.success('Login sucessfull');
          Navigate('/admin') 
        localStorage.setItem('loggedIn',true)
        localStorage.setItem('user_id',response.data.user._id)
        }else{
        localStorage.setItem('loggedIn',true)
        localStorage.setItem('user_id',response.data.user._id)
        toast.success("login successfully");
        Navigate("/");
        }
      })
      .catch(function (error) {
        toast.error(error.message);
        console.log(error);
      });
    setUser({
      email: "",
      password: "",
    });
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
            value={user.email}
            placeholder="Enter your Email"
            onChange={HandaleChange}
          ></input>
          <input
             type={changePassword ? "password" : "text"}
            
            className="input"
            name="password"
            value={user.password}
            placeholder="Enter Your Password"
            onChange={HandaleChange}
          ></input>
          <span id="icon"
                 onClick={() => {
                    setChangePassword(changeIcon);
                 }}
              >
                 {changeIcon ? <Eye/> : <EyeOff/>}
              </span>
           
          <button id="button" onClick={logins}>
            Login
          </button>
          <div className="or">or</div>
          <a href="/register">
          <button id="button">
          Register
           </button>
            </a>
          <a id="forget" href="/forgetpassword">Forget Password</a>
        </div>
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Login;
