import React from 'react';
import styles from './footer.module.css';
import { Instagram, Linkedin, Mail, Phone, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* About Us Section */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>About Us</h3>
          <p className={styles.footerText}>
            E-commerce, or electronic commerce, is the exchange of goods and services, and 
            the transmission of funds and data over the internet. It relies on technology 
            and digital platforms, including websites, mobile apps, and social media.
          </p>
        </div>
        
        {/* Contact Us Section */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contact Us</h3>
          <p className={styles.contactItem}>
            <Mail className={styles.icon} /> 
            <a href="mailto:mandalshivam962@com" className={styles.contactLink}>mandalshivam962@gmail.com</a>
          </p>
          <p className={styles.contactItem}>
            <Phone className={styles.icon} /> 
            <a href="tel:+6200874410" className={styles.contactLink}>6200874410</a>
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Follow Us</h3>
          <p className={styles.footerText}>Connect with us on social media</p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink}><Instagram /></a>
            <a href="https://github.com/Shivam6200930" className={styles.socialLink}><Github /></a>
            <a href="https://www.linkedin.com/in/shivam-mandal-664a71253/" className={styles.socialLink}><Linkedin /></a>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className={styles.copyright}>
        <p>&copy; 2024 Shivam Mart Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
