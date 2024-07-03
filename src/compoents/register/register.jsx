// src/components/Register.js
import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest, registerSuccess, registerFailure } from "../../redux/action/Actions";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector(state => state.register);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    phone: "",
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

  const registers = async () => {
    const { name, email, password, password_confirm, phone } = user;
    if ((password === password_confirm) && !(password.match(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/)) ) {
      if ((name && name.length >= 2) && email && phone) {
        dispatch(registerRequest());
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
            {
              name,
              email: email.toLowerCase(),
              password,
              password_confirm,
              phone,
            },
            { withCredentials: true }
          );
          console.log(response);
          dispatch(registerSuccess("Register successfully"));
          alert("Register successfully");
          navigate("/login");
        } catch (error) {
          if (error.response.data.email) {
            dispatch(registerFailure(error.response.data.email.message));
          } else if (error.response.data) {
            dispatch(registerFailure(error.response.data.phone.message));
          } else {
            dispatch(registerFailure("Registration failed"));
          }
        }
      } else {
        setUser({
          name: "",
          email: "",
          password: "",
          password_confirm: "",
          phone: "",
        });
        alert("All fields are required");
      }
    } else {
      alert("Please enter the same password in re-enter password");
    }
  };

  return (
    <>
      <div className="Login-container">
        <div className="register">
          <h1>Register</h1>
          <hr></hr>
          <input
            type="text"
            className="input"
            name="name"
            value={user.name}
            placeholder="Enter your name"
            onChange={HandaleChange}
          ></input>
          <input
            type="text"
            className="input"
            name="email"
            value={user.email}
            placeholder="Enter your Email"
            onChange={HandaleChange}
          ></input>
          <input
            type="number"
            className="input"
            name="phone"
            value={user.phone}
            placeholder="Enter your phone number"
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
          <span
            className="icon1"
            onClick={() => {
              setChangePassword(changeIcon);
            }}
          >
            {changeIcon ? <Eye /> : <EyeOff />}
          </span>
          <input
            type={changePassword ? "password" : "text"}
            className="input"
            name="password_confirm"
            value={user.password_confirm}
            placeholder="Re-enter Password"
            onChange={HandaleChange}
          ></input>

          <div id="button1" onClick={registers}>
            Register
          </div>
          <div className="">or</div>
          <a href="/login">
            <button id="button">Login</button>
          </a>
        </div>
      </div>
    </>
  );
};

export default Register;
