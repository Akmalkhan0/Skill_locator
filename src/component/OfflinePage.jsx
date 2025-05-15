import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/offline.css";

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      navigate(-1); // Go back to previous page when connection is restored
    }
  }, [isOnline, navigate]);

  return (
    <div className="offline-container">
      <div className="offline-content">
        <h2>You're Offline</h2>
        <p>Please check your internet connection and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
          disabled={!isOnline}
        >
          {isOnline ? "Retry Now" : "No Connection"}
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;