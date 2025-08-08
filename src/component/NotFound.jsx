import React from 'react';
import { Link } from 'react-router-dom';
import '../css/not-found.css';
import SEO from './SEO';
import { pageMeta } from '../config/seo.config';

const NotFound = () => {
  return (
    <>
      <SEO 
        title={pageMeta.notFound.title}
        description={pageMeta.notFound.description}
        keywords={pageMeta.notFound.keywords}
      />
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Link to="/" className="home-button">Go to Homepage</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;