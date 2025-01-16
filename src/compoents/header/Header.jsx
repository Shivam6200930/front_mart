import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { CircleUserRound, History, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({
    image: '',
    name: '',
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const loggedIn = localStorage.getItem('loggedIn');

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
        const temp = {
          name: response.data.user.name,
          image: response.data.user.profileImageUrl,
        };
        setData(temp);
      } catch (error) {
        console.error('Error fetching user photo:', error);
      }
    };

    if (loggedIn) {
      fetchUserPhoto();
    }
  }, [loggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    navigate(`/search_products/?q=${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (

    <div className="header">
      <div className="logo">
        <a href="/">Shivam Mart</a>
        <img src="./s-logo.svg" alt="logo" height="40" width="40" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

      </div>

      <div className="user-actions">
        {loggedIn ? (
          <div className="user-profile" ref={dropdownRef}>

            <div className="profile-button" onClick={toggleDropdown}>
              {data.image ? (
                <img src={data.image} alt="User" />
              ) : (
                <CircleUserRound />
              )}
            </div>
            <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
              <div className="dropdown-header">Hey, {data.name}</div>
              <div className="dropdown-item" onClick={() => navigate('/profile')}>
                Profile
              </div>
              <div className="dropdown-item" onClick={() => navigate('/orderhistory')}>
                Order History
              </div>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
        {loggedIn && (
          <div className="cart">
            <a href="/cart">
              <ShoppingCart />
            </a>
          </div>
        )}
         {loggedIn?(<div className="mobile-menu-icon" onClick={toggleSidebar}>
            ☰
          </div>):(<></>)}
       
      </div>

      {/* Sidebar for mobile view */}
      <div className={`mobile-sidebar ${showSidebar ? 'active' : ''}`} ref={sidebarRef}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✖
        </button>
        <ul>
          <li onClick={() => { navigate('/profile'); setShowSidebar(false); }}>
            <CircleUserRound /> Profile
          </li>
          <li onClick={() => { navigate('/cart'); setShowSidebar(false); }}>
            <ShoppingCart /> Cart
          </li>
          <li onClick={() => { navigate('/orderhistory'); setShowSidebar(false); }}>
            <History /> Order History
          </li>
        </ul>
      </div>
    </div>

  );
};

export default Header;
