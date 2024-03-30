// Footer.js
import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>E-commerce, or electronic commerce, is the exchange of goods and services, and the transmission of funds and data over the internet. It relies on technology and digital platforms, including websites, mobile apps, and social media. 
</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: mandalshivam962.com</p>
          <p>Phone: 6200874410</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Connect with us on social media</p>
          {/* Add social media icons or links here */}
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2024 Your E-commerce Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
