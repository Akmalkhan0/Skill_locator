import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import './App.css'


// Components
import Profile from "./component/profile";
import Login from "./component/Login";
import Register from "./component/Register";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Tutorial from "./component/Tutorial";
import ProfileViewer from "./component/ProfileViewer";
import OfflinePage from "./component/OfflinePage";
import NotFound from "./component/NotFound";
import Home from "./component/home";


const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // When coming back online, check auth and refresh
      window.location.reload();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    // Handle auth only when online
    if (navigator.onLine) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setTimeout(() => {
          setCheckingAuth(false);
        }, 200);
      });

      return () => {
        unsubscribe();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Highest priority: Offline page
  if (!isOnline) {
    return <OfflinePage />
  }

  // Second priority: Auth loading (only when online)
  if (checkingAuth) {
    return (<>
      <div className="loading-container">
        <img src="/loading.png" alt="Loading..." className="loading-spinner-img" />
        <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row', margin: '10px' }}>
          <img src="/favicon.png" alt="Loading..." width={'50px'} />
          <h1>Skill Locator</h1>
        </div>
      </div>
    </>);
  }

  if (!isOnline) {
    return <OfflinePage />
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
          path="/Skills"
          element={<div>Comming soon...</div>}
        />
        <Route
          path="/jobs"
          element={<div>Comming soon...</div>}
        />
        <Route
          path="/contact"
          element={<div>Comming soon...</div>}
        />
          <Route
          path="/faq"
          element={<div>Comming soon...</div>}
        />
        <Route
          path="/privacy"
          element={<div>Comming soon...</div>}
        />
        <Route
          path="/terms"
          element={<div>Comming soon...</div>}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
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
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
