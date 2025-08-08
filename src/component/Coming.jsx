import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import '../css/coming.css';
import SEO from './SEO';
import { pageMeta } from '../config/seo.config';

const ComingSoon = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Coming Soon - Something Amazing',
          text: 'Check out this amazing new platform launching soon!',
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };


  return (
    <>
      <SEO 
        title={pageMeta.comingSoon.title}
        description={pageMeta.comingSoon.description}
        keywords={pageMeta.comingSoon.keywords}
      />
      <div className="coming-component">
      <div className="coming-content">
        <div className="coming-header">
          <h1 className="coming-title">Coming Soon</h1>
          <h3 className="notify-title">Stay Notified</h3>
          <button onClick={handleShare} className="share-btn">
            <FontAwesomeIcon icon={faShare} />
            {copiedLink ? 'Link Copied!' : '  Share'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ComingSoon;