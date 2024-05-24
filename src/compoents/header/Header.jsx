import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { CircleUserRound , History  ,ShoppingCart } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [data, setData] = useState({
    image: ""
  });
  const [showSidebar, setShowSidebar] = useState(false); 
  const sidebarRef = useRef(null);
  const loggedIn=localStorage.getItem('loggedIn');

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        console.log(`image:${response.data.user.profileImageUrl}`);
        const temp = {
          name: response.data.user.name,
          email: response.data.user.email,
          image: response.data.user.profileImageUrl
        };
        setData(temp);
      } catch (error) {
        console.error('Error fetching user photo:', error);
      }
    };

    fetchUserPhoto();
  }, []);

  const handleSearch = async () => {
    navigate(`/search_products/?q=${searchQuery}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/search?q=${searchQuery}`, { withCredentials: true });
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <a href="/">Shivam Mart</a>
          <img src=".././public/s-logo.svg" alt="logo" height="40" width="40" />
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
            <button className="profile-button-admin-15" onClick={() => navigate("/profile")}>
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
                <span role="img" aria-label="add items">+</span>
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
          {
            (showSidebar) ? (<div className="cut" onClick={toggleSidebar}>X</div>):(loggedIn?(<div className="sidebar-trigger" onClick={toggleSidebar}>
            ☰
          </div>):(<></>))
          }
         
        </div>
      </div>
      <div className={`sidebar ${showSidebar ? 'active' : ''}`} ref={sidebarRef}>
        <ul>
        <li><a href="/profile"><CircleUserRound/>profile</a></li>
            <li><a href="/cart"><ShoppingCart/>cart</a></li>
            <li><a href="/orderhistory"><History />oder History</a></li>
        </ul>
      </div>
    </>
  );
};

export default Header;
