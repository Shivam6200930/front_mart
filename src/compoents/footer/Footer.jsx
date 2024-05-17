// Footer.js
import React from 'react';
import './footer.css';
import { Instagram } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';
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
          <p>Email: mandalshivam962@com</p>
          <p>Phone: 6200874410</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Connect with us on social media</p>
          <a className="social-icon" href=""> <Instagram /></a>
          <a className="social-icon" href='https://github.com/Shivam6200930'><Github /></a>
          <a className="social-icon" href="https://www.linkedin.com/in/shivam-mandal-664a71253/"><Linkedin /></a>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2024 Your E-commerce Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
