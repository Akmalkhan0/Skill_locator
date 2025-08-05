import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/offline.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi, faSignal, faRefresh } from "@fortawesome/free-solid-svg-icons";

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
        <div className="offline-icon">
          <FontAwesomeIcon icon={faWifi} size="4x" />
        </div>
        <h2>You're Offline</h2>
        <p>We can't connect to the internet right now. Here's what you can do:</p>
        <ul className="offline-tips">
          <li>Check your Wi-Fi or mobile data connection</li>
          <li>Make sure airplane mode is turned off</li>
          <li>Try restarting your router</li>
        </ul>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
          disabled={!isOnline}
        >
          <FontAwesomeIcon icon={faRefresh} /> {isOnline ? "Retry Now" : "No Connection"}
        </button>
        <p className="connection-status">
          <FontAwesomeIcon icon={faSignal} /> Connection status: 
          <span className={isOnline ? "online" : "offline"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OfflinePage;