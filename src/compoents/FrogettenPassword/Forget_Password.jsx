import React from 'react';
import './forgrt_password.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forget_Password() {
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
      if(!user.email){
        alert('Please enter your mail')
      }else{
       await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sendresetPassword`,
        {
          email: user.email
        },
        { withCredentials: true }
      );
      navigate('/login'); 
      toast.success('Mail sent successfully; this is only valid for 10 minutes');
    }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
    setUser({
      email: ''
    });
  };

  return (
    <>
      <div className="Forget-container">
        <div className="Forget-f">
          <input
            type='text'
            name='email'
            placeholder='Enter your email'
            value={user.email}
            onChange={handleChange}
          />
          <button onClick={forget} className='btn-edit'>
            Forget Password
          </button>
        </div>
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default Forget_Password;
