import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import '../css/login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import SEO from './SEO';
import { pageMeta } from '../config/seo.config';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile"); // go to profile
    } catch (err) {
      console.error("Error during login:", err);
      if (err.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={pageMeta.login.title}
        description={pageMeta.login.description}
        keywords={pageMeta.login.keywords}
      />
      <div className="login-form">
      <div className="app-header">
        <h1>Skill Locator</h1>
        <p>Find and showcase your skills</p>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="Inputbox"
            style={{ paddingLeft: '35px' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="Inputbox"
            style={{ paddingLeft: '35px' }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
    </>
  );
};

export default Login;
