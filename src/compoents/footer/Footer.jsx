// Footer.js
import React from 'react';
import './footer.css';
import { Instagram } from 'lucide-react';
import { Linkedin,Mail,Phone } from 'lucide-react';
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
  <p><Mail /> <a href="mailto:mandalshivam962@com">mandalshivam962@gmail.com</a></p>
  <p><Phone /> <a href="tel:+6200874410">6200874410</a></p>
</div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Connect with us on social media</p>
          <a className="social-icon" href="#"> <Instagram /></a>
          <a className="social-icon" href='https://github.com/Shivam6200930'><Github /></a>
          <a className="social-icon" href="https://www.linkedin.com/in/shivam-mandal-664a71253/"><Linkedin /></a>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2024 Shivam Mart Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
