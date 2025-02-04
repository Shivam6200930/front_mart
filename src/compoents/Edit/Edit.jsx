import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Edit.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Edit({onClose}) {
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/edit/${id}`, { user_name: user.name }, { withCredentials: true });
      alert("Updated successfully!!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
     <div id="container-edit">
      <div className="edit-container">
         <button className="closeEditButton"onClick={onClose}>✕</button>
     
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
        </div>
      </div>
      <ToastContainer position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default Edit;
