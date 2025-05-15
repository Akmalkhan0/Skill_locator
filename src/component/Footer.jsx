import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';
import '../css/register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Designers & developer</h4>
          <p><a href="https://www.linkedin.com/in/akmalkhan0">Akmal Khan</a></p>
          <p><a href="https://wwww.linkedin.com/in/musahidmansuri0">Musahid Mansuri</a></p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/akmalkhan0" target="_blank" rel="noopener noreferrer">LinkedIn 1</a>
            <a href="https://www.linkedin.com/in/musahidmansuri0" target="_blank" rel="noopener noreferrer">LinkedIn 2</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: <p>Akmalkhann0@gmail.com</p> <p> Musahidmansuri555@gmail.com</p></p>
          <p>Phone: <p>+91 626XXXXX52</p><p>+91 798XXXXX79</p> </p>
        </div>
        
        <div className="footer-section">
          <h4>Useful Resources</h4>
          <ul>
            <li><Link to="#">Help Center</Link></li>
            <li><Link to="/tutorials">Tutorials</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Newsletter</h4>
          <form className="newsletter-form">
            <FontAwesomeIcon icon="envelope" className="icon"  style={{color:'#ff5500', position:'absolute', top:'15%',left:'5%',zIndex:'5'}}/>
            <input type="email" placeholder="Your email address" required className='Inputbox'/>
            <button type="submit" >Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Skill Locator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;