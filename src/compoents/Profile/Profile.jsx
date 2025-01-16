import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Profile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Daiog from './Daiog';
import Edit from '../Edit/Edit';
import ChangePassword from '../changeUserPassword/ChangeUserPassword';
import DailogDelete from "./DailogDelete";
import { Mail, PhoneCall } from 'lucide-react';
import { useSelector } from "react-redux";

const Profile = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteId , setShowDeleteId] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem('user_id');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: "",
    name: "",
    email: "",
    phone: ""
  });

  const responses =useSelector(state=>state.login)
    console.log(responses)
  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
      const temp = {
        id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        image: response.data.user.profileImageUrl,
        phone: response.data.user.phone
      };
      setData(temp);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function clearData() {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout/${data.id}`, { withCredentials: true });
      localStorage.clear();
      toast.success("Logout successfully!");
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const deleteId = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/delete/${data.id}`, { withCredentials: true });
      toast.success(`${name} Delete your id successfully!`);
      navigate('/login');
      localStorage.clear();
    } catch (error) {
      console.error('Failed to delete user ID:', error);
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (selectedImage) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/imageupload/${id}`, formData, { withCredentials: true });
      if (response.data && response.data.image) {
        setImageUrl(response.data.image);

        // Update data.image state
        setData(prevData => ({
          ...prevData,
          image: response.data.image
        }));

        toast.success('Image upload successfully!');
        navigate('/profile');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/profileImageDelete/${id}`, { withCredentials: true });
      console.log(response);
      if (response.data.status === 'success') {
        setData(prevData => ({
          ...prevData,
          image: ""
        }));
        toast.success('Image deleted successfully!');
      } else {
        toast.error(response.data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const openFileInput = () => {
    setShowDialog(true);
  };

  const handleConfirm = () => {
    document.getElementById('fileInput').click();
    setShowDialog(false);
  };

  const handleCancel = () => {
    deleteImage();
    setShowDialog(false);
  };

  const handleClose = () => {
    setShowDialog(false);
  }

  const handleEditClose = () => {
    setShowEdit(false);
  }

  const handleChangePasswordClose = () => {
    setShowChangePassword(false);
  }

  const preventDefault = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log('showChangePassword:', showChangePassword);
  }, [showChangePassword]);

  return (
    <div className="main-profile">
      <div className="profile-container">
        <div className="left-section">
          <div className="profile-image-box">
            {loading && (
              <div id="loading-container">
                <div id="loading-spinner"></div>
                <p>Loading.....</p>
              </div>
            )}
            <div className="i-n">
              {data.image ? (
                <img key={data.image} src={data.image} onClick={openFileInput} alt="Profile" />
              ) : (
                !loading ? (
                  <svg onClick={openFileInput} xmlns="http://www.w3.org/2000/svg" width="100" height="105" viewBox="3 2 17 19" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                ) : (<></>)
              )}
            </div>
            <input id="fileInput" type="file" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>
          <div className="h1-admin">
            <h1>{data.name}</h1>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="right-section">
          <div className="user-information">
            <p> <Mail /> {data.email}</p>
            <p><PhoneCall /> {data.phone}</p>
            
          </div>
          <div className="bottom-section">
            <button className="change-password-btn" onClick={() => setShowChangePassword(true)} onMouseDown={preventDefault}>Change Password</button>
            <button onClick={clearData} className="logout-btn">Logout</button>
            <button className="change-password-btn" onClick={() => setShowEdit(true)} onMouseDown={preventDefault}>Edit Profile</button>
            <button className="change-password-btn" onClick={() => navigate('/')} onMouseDown={preventDefault}>Homepage</button>
            <button className="change-password-btn" onClick={()=>setShowDeleteId(true)} onMouseDown={preventDefault}>Delete ID</button>
          </div>
        </div>
        {showDialog && (
          <Daiog
            message="Do you want to update the image or delete it?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={handleClose}
          />
        )}
        {showEdit && (
          <Edit
            onClose={handleEditClose}
          />
        )}
        {showChangePassword && (
          <ChangePassword onClose={handleChangePasswordClose} />
        )}
        {
         showDeleteId && (
         <DailogDelete
           message="Do you want to delete this account?"
           onConfirm={deleteId}
           onCancel={()=>{setShowDeleteId(false)}}
           onClose={()=>{setShowDeleteId(false)}}
         />)
        }
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
      </div>
  );
};

export default Profile;
