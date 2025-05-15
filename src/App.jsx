import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Components
import Profile from "./component/profile";
import Login from "./component/Login";
import Register from "./component/Register";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Icon from "./component/Icon";
import Tutorial from "./component/Tutorial";
import ProfileViewer from "./component/ProfileViewer";
import OfflinePage from "./component/OfflinePage";
import Home from "./component/home";

const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (checkingAuth) {
    return <h3>Checking authentication...</h3>; // or a spinner
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<Login /> }
        />
        <Route
          path="/register"
          element={<Register /> }
        />
        <Route
          path="/tutorials"
          element={<Tutorial />}
        />
        <Route
          path="/profile/:id"
          element={<ProfileViewer />}
        />
        <Route
          path="/offline"
          element={<OfflinePage />}
        />
      </Routes>
      <Footer />
      </Router>
  );
};

export default App;
