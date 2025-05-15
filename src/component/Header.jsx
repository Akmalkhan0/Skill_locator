import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      if (window.innerWidth >= 800) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        setUser({ ...authUser, profile: userDoc.data()?.profile });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <h1 className="logo-text">
              Skill Locator</h1>
          </Link>
        </div>

        {isMobile ? (
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="menu-icon"></span>
          </button>
        ) : (
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/skills" className="nav-link">Skills</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="auth-btn login-btn">Login</Link>
            {user ? (
              <Link to="/profile" className="profile-link">
                {user.profile?.profilePicture ? (
                  <img src={user.profile.profilePicture} alt="Profile" className="profile-pic" />
                ) : 'Profile'}
              </Link>
            ) : (
              <>
              <Link to="/register" className="auth-btn register-btn">Register</Link>
              </>
            )}
          </nav>
        )}
      </div>

      {isMobile && isOpen && (
        <div className="mobile-menu">
          {user ? (
            <Link to="/profile" className="mobile-link" onClick={toggleMenu}>
              {user.profile?.profilePicture ? (
                < div style={{display:'flex',alignItems:'center',}}>
                <img src={user.profile.profilePicture} alt="Profile" className="mobile-profile-pic" style={{scale:'1.5',marginLeft:'20px'}} />
                <p style={{marginLeft:'10px',textTransform:'capitalize',fontSize:'18px'}}>{user.profile.fullName}</p>
                </div>
              ) : 'Profile'}
            </Link>
          ) : (
            <Link to="/profile" className="mobile-link" onClick={toggleMenu}>Profile</Link>
          )}
          <Link to="/" className="mobile-link" onClick={toggleMenu}>Home</Link>
          <Link to="/skills" className="mobile-link" onClick={toggleMenu}>Skills</Link>
          <Link to="/jobs" className="mobile-link" onClick={toggleMenu}>Jobs</Link>
          <Link to="/contact" className="mobile-link" onClick={toggleMenu}>Contact</Link>
          <Link to="/login" className="mobile-auth-btn mobile-login-btn" onClick={toggleMenu}>Login</Link>
          <Link to="/register" className="mobile-auth-btn mobile-register-btn" onClick={toggleMenu}>Register</Link>
        </div>
      )}
    </header>
  );
}