import React, { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header_admin.css';
import { CircleUserRound , StretchHorizontal ,ShoppingCart } from 'lucide-react';
import axios from 'axios';
const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [data,setData] = useState({
    image:""
  })
  const [showSidebar, setShowSidebar] = useState(false); 
  const sidebarRef = useRef(null);
  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/loggedUser`, { withCredentials: true });
      console.log(`image:${response.data.user.profileImageUrl}`)
      const temp = {
        name: response.data.user.name,
        email: response.data.user.email,
        image:response.data.user.profileImageUrl
      };
      setData(temp);
      } catch (error) {
        console.error('Error fetching user photo:', error);
      }
    };
  
    fetchUserPhoto();
  }, []);

  
  const handleSearch = async () => {
    navigate(`/search_admin/?q=${searchQuery}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?q=${searchQuery}`, { withCredentials: true });
      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data);
      } else {
        console.error('Error fetching search results');
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
    <div className="header">
      <div className="logo">
        <a href="/admin">Shivam Mart</a>
      </div>
      <div className="s-bar">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="user-actions">
        {localStorage.getItem('loggedIn') ? (
          <button className="profile-button-admin-15" onClick={() => navigate("/profile_admin")}>
            {data.image ? (
              <img src={data.image} alt="User" />
            ) : (
              <CircleUserRound />
            )}
          </button>
          
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
        {localStorage.getItem('loggedIn') && (
          <div className="additems-admin">
            <a href="/additems">
              <span role="img" aria-label="cart">+</span>
            </a>
          </div>
        )}
        {localStorage.getItem('loggedIn') && (
          <div className="cart">
            <a href="/cart_admin">
              <span role="img" aria-label="cart">🛒</span>
            </a>
          </div>
        )}
        <div className="sidebar-trigger" onClick={() => setShowSidebar(!showSidebar)}>
          ☰
        </div>
        
      </div>
      {showSidebar && (
        <div className="sidebar" ref={sidebarRef}>
          <div className="cut" onClick={() => setShowSidebar(!showSidebar)}>X</div>
          <ul>
            <li><a href="/profile_admin" ><CircleUserRound/> Profile</a></li>
            <li><a href="/additems"><StretchHorizontal />  Add Items</a></li>
            <li><a href="/cart_admin"><ShoppingCart />Cart</a></li>
          </ul>
        </div>
      )}
      
    </div>
    </>
  );
};

export default Header;
