import React from "react";
import styles from "../css/Header_admin.module.css"; 0
const Header_admin = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <h1 className={styles.logo}>AdminPanel</h1>
            </div>
            <div className={styles.userSection}>
                <div className={styles.userProfile}>
                    <img 
                        className={styles.userAvatar} 
                        src="https://via.placeholder.com/40" 
                        alt="User Avatar" 
                    />
                    <span className={styles.username}>Admin</span>
                </div>
            </div>
        </header>
    );
};

export default Header_admin;
