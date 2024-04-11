import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Profile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem('user_id');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: ""
  });

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get("https://new-backend-s80n.onrender.com/api/users/loggedUser", { withCredentials: true });
      const temp = {
        name: response.data.user.name,
        email: response.data.user.email,
        image:response.data.user.profileImageUrl
      };
      setData(temp);
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function clearData() {
    try {
      await axios.get("https://new-backend-s80n.onrender.com/api/users/logout", { withCredentials: true });
      localStorage.clear();
      toast.success("Logout successfully!");
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const deleteId = async () => {
    try {
      await axios.post(`https://new-backend-s80n.onrender.com/api/users/delete/${id}`, {}, { withCredentials: true });
      toast.success(`${name} Delete your id successfully!`);
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
      setLoading(true)
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await axios.post(`https://new-backend-s80n.onrender.com/api/users/imageupload/${id}`, formData, { withCredentials: true });
      if (response.data && response.data.image) {
        setImageUrl(response.data.image);
        
        // Update data.image state
        setData(prevData => ({
          ...prevData,
          image: response.data.image
        }));
  
        toast.success('image upload successfully!');
        navigate('/profile_admin');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }finally{
      setLoading(false)
    }
  };
  

  const openFileInput = () => {
    document.getElementById('fileInput').click();
  }

  const preventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="profile-container">
        <div className="left-section" >
          <div className="profile-image-box">
          {loading && (
                        <div id="loading-container">
                            <div id="loading-spinner"></div>
                            <p>updated</p>
                        </div>
                    )}
          <img key={data.image} src={data.image} onClick={openFileInput} alt="Profile" />
          <input id="fileInput" type="file" onChange={handleImageChange} style={{ display: 'none' }} />

          </div>
          <div className="h1-admin">
            <h1>{data.name}</h1>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="right-section">
          <div className="user-information">
            <p>Email: {data.email}</p>
            <p></p>
          </div>
          <div className="bottom-section">
            <button className="change-password-btn" onClick={() => navigate('/changepassword')} onMouseDown={preventDefault}>Change Password</button>
            <button onClick={clearData} className="logout-btn">Logout</button>
            <button className="change-password-btn" onClick={() => navigate('/editprofile')} onMouseDown={preventDefault}>Edit Profile</button>
            <button className="change-password-btn" onClick={() => navigate('/admin')} onMouseDown={preventDefault}>Homepage</button>
            <button className="change-password-btn" onClick={deleteId} onMouseDown={preventDefault}>Delete ID</button>
          </div>
        </div>
        <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Profile;
