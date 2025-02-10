import { Link ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../css/Header_admin.module.css";
import axios from 'axios'

const AdminHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data,setData]=useState({
    name:"",
    id:""
  })
  const navigate = useNavigate(); // Change this to dynamically fetch admin name
 
  
  useEffect(()=>{
    const fetchUserPhoto = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/loggedUser`, { withCredentials: true });
          const temp = {
            name: response.data.user.name,
            id: response.data.user._id,
          };
          setData(temp);
        } catch (error) {
          console.error('Error fetching user photo:', error);
        }
      };
      
        fetchUserPhoto();
  },[])
  const handleLogout = async() => {
    try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout/${data.id}`, { withCredentials: true });
        localStorage.clear();
        navigate('/');
        toast.success("Logout successfully!");
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    console.log("Logging out...");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <img src="./s-logo.svg" alt="logo" height="40" width="40" />
      <Link to="/admin" className={styles.logo}>
        Shivam Mart
      </Link>

      {/* Mobile Hamburger */}
      <div className={styles.hamburger} onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Admin Dropdown for Desktop */}
      <div className={styles["menu-container"]}>
        <div
          className={styles["menu-button"]}
          onClick={toggleDropdown}
        >
          {data.name}
        </div>
        {isDropdownOpen && (
          <div className={styles["menu-list"]}>
            <div className={styles["menu-item"]}>
              <Link to="/product-manager" className={styles["menu-item-link"]}>
                Product Manager
              </Link>
            </div>
            <div className={styles["menu-item"]}>
              <Link to="/order-manager" className={styles["menu-item-link"]}>
                Order Manager
              </Link>
            </div>
            <div className={styles["menu-item"]} onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`${styles["mobile-menu-list"]} ${isMobileMenuOpen ? 'show' : ''}`}>
          <div className={styles["mobile-menu-item"]}>
            <Link to="/product-manager" className={styles["menu-item-link"]}>
              Product Manager
            </Link>
          </div>
          <div className={styles["mobile-menu-item"]}>
            <Link to="/order-manager" className={styles["menu-item-link"]}>
              Order Manager
            </Link>
          </div>
          <div className={styles["mobile-menu-item"]} onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
