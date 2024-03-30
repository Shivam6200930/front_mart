import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Edit_admin.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Edit() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    console.log(user);
    const id = localStorage.getItem('user_id');
    try {
      if (!user.name) {
        toast.info('Name is required'); 
        return;
      }
      await axios.put(`https://backend-shivammart.vercel.app/api/users/edit/${id}`, { user_name: user.name }, { withCredentials: true });
      toast.success("Updated successfully!!");
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
     <div id="container-edit">
      <div className="edit-container">
       <h1>Edit your profile</h1>
        <input
          type='text'
          name='name'
          placeholder='Enter your name'
          value={user.name}
          onChange={handleChange}
        />
        <div id="edhm-page">
        <button onClick={handleEdit} id='btn-edit'>Edit</button>
        <button id='btn-hom' onClick={() => navigate('/admin')}>Homepage</button>
        </div>
      </div>
      <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default Edit;
