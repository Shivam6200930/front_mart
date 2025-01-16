import React, { useState } from "react";
import styles from "./register.module.css";
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
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[@$!%?&]/.test(password),
    };
    setPasswordValidation(rules);
  };

  const handlePasswordFocus = () => {
    setShowPasswordRules(true);
  };

  const handlePasswordBlur = () => {
    setShowPasswordRules(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const registerUser = async () => {
    const { name, email, password, password_confirm, phone } = user;
    const isPasswordValid = Object.values(passwordValidation).every((rule) => rule);

    if (password === password_confirm && isPasswordValid) {
      if (name && name.length >= 2 && email && phone) {
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
          dispatch(registerSuccess("Register successfully"));
          toast.success("Register successfully");
          navigate("/login");
        } catch (error) {
          const errorMessage = error.response?.data?.email?.message || error.response?.data?.phone?.message || "Registration failed";
          dispatch(registerFailure(errorMessage));
          toast.error(errorMessage);
        }
      } else {
        toast.error("All fields are required");
      }
    } else {
      toast.error("Passwords must match and meet complexity requirements");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Register</h1>
        <hr className={styles.divider} />
        <input
          type="text"
          className={styles.inputField}
          name="name"
          value={user.name}
          placeholder="Enter your name"
          onChange={handleInputChange}
        />
        <input
          type="text"
          className={styles.inputField}
          name="email"
          value={user.email}
          placeholder="Enter your Email"
          onChange={handleInputChange}
        />
        <input
          type="number"
          className={styles.inputField}
          name="phone"
          value={user.phone}
          placeholder="Enter your phone number"
          onChange={handleInputChange}
        />
        <div className={styles.passwordWrapper}>
          <input
            type={changePassword ? "password" : "text"}
            className={styles.inputField}
            name="password"
            value={user.password}
            placeholder="Enter Your Password"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onChange={handleInputChange}
          />
          <span
            className={styles.icon}
            onClick={() => setChangePassword(!changePassword)}
          >
            {changePassword ? <Eye /> : <EyeOff />}
          </span>
        </div>
        {showPasswordRules && (
          <div className={styles.passwordRules}>
            <p className={passwordValidation.length ? styles.valid : styles.invalid}>
              At least 8 characters
            </p>
            <p className={passwordValidation.uppercase ? styles.valid : styles.invalid}>
              At least one uppercase letter
            </p>
            <p className={passwordValidation.lowercase ? styles.valid : styles.invalid}>
              At least one lowercase letter
            </p>
            <p className={passwordValidation.number ? styles.valid : styles.invalid}>
              At least one number
            </p>
            <p className={passwordValidation.specialChar ? styles.valid : styles.invalid}>
              At least one special character (@, $, !, %, ?, &)
            </p>
          </div>
        )}
        <input
          type={changePassword ? "password" : "text"}
          className={styles.inputField}
          name="password_confirm"
          value={user.password_confirm}
          placeholder="Re-enter Password"
          onChange={handleInputChange}
        />
        <button className={styles.registerButton} onClick={registerUser}>
          Register
        </button>
        <div className={styles.orText}>or</div>
        <a href="/login">
          <button className={styles.loginButton}>Login</button>
        </a>
      </div>
    </div>
  );
};

export default Register;
