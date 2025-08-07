import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, 'users'));
        const providersData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const results = searchTerm ?
      providers.filter(provider =>
        provider.provider?.services?.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        provider.provider?.services?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) : providers;
    setFilteredProviders(results);
  }, [searchTerm, providers]);

  return (
    <div className="home-container">
      <div className="search-container">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by skills or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="cards-container">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="user-card skeleton-card" style={{ width: '80vw' }}>
              <div className="user-card-header">
                <div className="skeleton skeleton-circle"></div>
                <div className="skeleton skeleton-line medium"></div>
              </div>
              <div className="skeleton rating-container">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="skeleton-star star filled">
                    ★
                  </span>
                ))}
                <span className="skeleton-star rating-text">(5.0)</span>
              </div>
              <div className="skills-container1">
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
              </div>
              <div className="category-container">
                <div className='category-label'>Category:</div>
              <div className="skeleton skeleton-button category-value"></div>
              </div>
              <div className="skeleton skeleton-button" style={{width:'150px'}}></div>
            </div>))}
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="no-results">
          <p>No providers found matching your search.</p>
        </div>
      ) : (
        <div className="cards-container">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="user-card" style={{ width: '80vw' }}>
              <div className="user-card-header">
                {provider.profile?.profilePicture && (
                  <img
                    src={provider.profile.profilePicture}
                    alt="Profile"
                    className="user-profile-pic"
                  />
                )}
                <h3>{provider.profile?.fullName || 'Provider'}</h3>
              </div>
              {(provider.provider?.metrics?.rating || provider.provider?.metrics?.rating === 0) && (
                <div className="rating-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${provider.provider.metrics.rating > 0 && i < Math.floor(provider.provider.metrics.rating) ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                  <span className="rating-text">({provider.provider.metrics.rating.toFixed(1)})</span>
                </div>
              )}
              <div className="skills-container">
                {provider.provider?.services?.skills?.map((skill, index) => (
                  <span key={index} className="skill-capsule">{skill.trim()}</span>
                )) || "Not listed"}
              </div>
              <div className="category-container">
                <span className="category-label">Category:</span>
                <span className="category-value">{provider.provider?.services?.category || 'Not specified'}</span>
              </div>
              <Link to={`/profile/${provider.id}`} className="view-profile-btn">View Profile →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
