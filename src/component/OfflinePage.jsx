import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faSpinner, faGamepad, faRedo, faTimes, faCheck, faPlay } from '@fortawesome/free-solid-svg-icons';
import "../css/offline.css";
import SEO from './SEO';
import { pageMeta } from '../config/seo.config';

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamePosition, setGamePosition] = useState(50);
  const [gameDirection, setGameDirection] = useState(1);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('bestScore')) || 0;
  });
  const [gameTimeLeft, setGameTimeLeft] = useState(10);
  const [turnScore, setTurnScore] = useState(0);

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
      window.history.back();
    }
  }, [isOnline]);

  // Mini game logic - Fixed boundary issues and movement
  useEffect(() => {
    if (!gameActive) return;
    
    const gameLoop = setInterval(() => {
      setGamePosition(prev => {
        let newPos = prev + gameDirection * 3.5;
        if (newPos >= 92) {
          setGameDirection(-1); // Force left direction
          return 92;
        } else if (newPos <= 8) {
          setGameDirection(1); // Force right direction
          return 8;
        }
        return newPos;
      });
    }, 25);

    return () => clearInterval(gameLoop);
  }, [gameActive, gameDirection]);

  // Game timer logic - Fixed timer freezing issue
  useEffect(() => {
    if (!gameActive || gameTimeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setTurnScore(gameScore);
          if (gameScore > bestScore) {
            setBestScore(gameScore);
            localStorage.setItem('bestScore', gameScore.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, gameTimeLeft]);

  const handleGameClick = (e) => {
    if (!gameActive || gameTimeLeft <= 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const track = e.currentTarget;
    const clickX = e.clientX - track.getBoundingClientRect().left;
    const trackWidth = track.offsetWidth;
    const targetCenter = (gamePosition / 100) * trackWidth;
    const distance = Math.abs(clickX - targetCenter);
    const maxPoints = 100;
    const accuracy = Math.max(0, maxPoints - (distance / trackWidth * 200));
    
    setGameScore(prev => prev + Math.round(accuracy));
    
    // Add visual feedback
    const target = e.target.closest('.game-target') || e.currentTarget.querySelector('.game-target');
    if (target) {
      target.style.transform = 'translateY(-50%) scale(1.3)';
      setTimeout(() => {
        target.style.transform = 'translateY(-50%) scale(1)';
      }, 150);
    }
  };

  const preventGameInterruptions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setTurnScore(0);
    setGameTimeLeft(10);
    setGamePosition(50);
    setGameDirection(Math.random() > 0.5 ? 1 : -1);
  };

  const stopGame = () => {
    setGameActive(false);
    setGameTimeLeft(10);
    if (gameScore > bestScore) {
      setBestScore(gameScore);
      localStorage.setItem('bestScore', gameScore.toString());
    }
  };

  return (
    <>
      <SEO 
        title={pageMeta.offline.title}
        description={pageMeta.offline.description}
        keywords={pageMeta.offline.keywords}
      />
      <div className="offline-container">
      <div className="offline-content">
        <div className="offline-header">
          <FontAwesomeIcon icon={faWifi} className="offline-icon wifi-icon" />
          <h1 className="offline-title">Connection Interrupted</h1>
          <p className="offline-subtitle">
            We're working to restore your connection. Stay calm and try these solutions:
          </p>
        </div>
        
        <div className="connection-animation">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="reconnect-text">Intelligent reconnection in progress...</p>
        </div>
        
        <div className="offline-actions">
          <div className="action-cards">
            <div className="action-card">
              <FontAwesomeIcon icon={faRedo} className="action-icon" />
              <h4>Network Refresh</h4>
              <p>Toggle airplane mode or restart your router</p>
            </div>
            <div className="action-card">
              <FontAwesomeIcon icon={faWifi} className="action-icon" />
              <h4>Signal Check</h4>
              <p>Move closer to your WiFi source or try mobile data</p>
            </div>
            <div className="action-card">
              <FontAwesomeIcon icon={faGamepad} className="action-icon" />
              <h4>Skill Challenge</h4>
              <p>Master the target while waiting</p>
            </div>
            <div className="action-card">
              <FontAwesomeIcon icon={faSpinner} className="action-icon" />
              <h4>Wait & Retry</h4>
              <p>Sometimes patience is the best solution</p>
            </div>
          </div>
        </div>
        
        <div className="retry-section">
          <button 
            onClick={() => {
              setIsRetrying(true);
              fetch('/favicon.png', { method: 'HEAD', cache: 'no-cache' })
                .then(() => {
                  setIsOnline(true);
                  window.history.back();
                })
                .catch(() => {
                  setIsRetrying(false);
                });
            }} 
            className={`retry-button ${isRetrying ? 'loading' : ''}`}
            disabled={isOnline || isRetrying}
          >
            {isRetrying ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Analyzing Connection...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRedo} />
                Smart Reconnect
              </>
            )}
          </button>
          
          <div className="status-indicators">
            <div className={`status-item ${isOnline ? 'online' : 'offline'}`}>
              <FontAwesomeIcon icon={isOnline ? faCheck : faTimes} />
              <span>{isOnline ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Mini Game Section */}
        <div className="mini-game">
          {!gameActive ? (
            <div className="game-intro">
              <h4><FontAwesomeIcon icon={faGamepad} /> Skill Challenge</h4>
              <p>Master the target: {gameScore} points</p>
              <button onClick={startGame} className="game-button">
                <FontAwesomeIcon icon={faGamepad} />
                Begin Challenge
              </button>
            </div>
          ) : (
            <div className="game-area"
              onContextMenu={preventGameInterruptions}
              onDragStart={preventGameInterruptions}
              onSelectStart={preventGameInterruptions}
              onMouseDown={preventGameInterruptions}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: 0 }}>Score: <strong>{gameScore}</strong></p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Best: <strong>{bestScore}</strong></p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p className={`game-timer ${gameTimeLeft <= 3 ? 'urgent' : ''}`}>
                    {gameTimeLeft}s
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Time Left</p>
                </div>
              </div>
              
              <div 
                className="game-track" 
                onClick={handleGameClick}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="game-target" 
                  style={{ 
                    left: `${gamePosition}%`,
                    transform: `translateY(-50%)`
                  }}
                >
                  🎯
                </div>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Click anywhere on the track to catch the moving target!
              </p>
              
              {turnScore > 0 && !gameActive && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem 1rem', 
                  background: 'rgba(249, 115, 22, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(249, 115, 22, 0.3)'
                }}>
                  <p style={{ margin: 0, color: '#f97316', fontWeight: 'bold' }}>
                    Turn Complete! Final Score: {turnScore}
                  </p>
                  <button onClick={startGame} className="game-button small" style={{ marginTop: '0.5rem' }}>
                    <FontAwesomeIcon icon={faPlay} />
                    Play Again
                  </button>
                </div>
              )}
              
              {!gameActive && turnScore === 0 && (
                <button onClick={startGame} className="game-button small">
                  <FontAwesomeIcon icon={faPlay} />
                  Start Challenge
                </button>
              )}
              
              {gameActive && (
                <button onClick={stopGame} className="game-button small">
                  <FontAwesomeIcon icon={faTimes} />
                  End Challenge
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default OfflinePage;