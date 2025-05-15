import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/tutorial.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Tutorial = () => {
  const [expandedSections, setExpandedSections] = useState({
    introduction: false,
    registration: false,
    profile: false,
    skills: false,
    jobs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="tutorial-container">
      <h1>Skill Locator Tutorial</h1>
      
      <div className="tutorial-section">
        <div className="section-header2" onClick={() => toggleSection('introduction')}>
          <h2>Introduction</h2>
          <FontAwesomeIcon 
            icon={expandedSections.introduction ? faChevronUp : faChevronDown} 
            className="toggle-icon"
          />
        </div>
        {expandedSections.introduction && (
          <div className="section-content">
            <p>Welcome to Skill Locator, a platform that connects skilled professionals with those who need their services.</p>
            <p>This tutorial will guide you through all the features and how to use them effectively.</p>
          </div>
        )}
      </div>

      <div className="tutorial-section">
        <div className="section-header2" onClick={() => toggleSection('registration')}>
          <h2>Registration & Login</h2>
          <FontAwesomeIcon 
            icon={expandedSections.registration ? faChevronUp : faChevronDown} 
            className="toggle-icon"
          />
        </div>
        {expandedSections.registration && (
          <div className="section-content">
            <h3>How to Register:</h3>
            <ol>
              <li>Click on the 'Register' link in the header or footer</li>
              <li>Fill in all required personal information</li>
              <li>Select your role (Service Provider or Service Seeker)</li>
              <li>Complete your profile details</li>
              <li>Submit the form</li>
            </ol>
            <h3>How to Login:</h3>
            <ol>
              <li>Click on the 'Login' link in the header or footer</li>
              <li>Enter your email and password</li>
              <li>Click the Login button</li>
            </ol>
          </div>
        )}
      </div>

      <div className="tutorial-section">
        <div className="section-header2" onClick={() => toggleSection('profile')}>
          <h2>Profile Management</h2>
          <FontAwesomeIcon 
            icon={expandedSections.profile ? faChevronUp : faChevronDown} 
            className="toggle-icon"
          />
        </div>
        {expandedSections.profile && (
          <div className="section-content">
            <h3>Editing Your Profile:</h3>
            <ol>
              <li>Navigate to your Profile page</li>
              <li>Click on the 'Edit Profile' button</li>
              <li>Update any information you want to change</li>
              <li>Upload a new profile picture if desired</li>
              <li>Save your changes</li>
            </ol>
          </div>
        )}
      </div>

      <div className="tutorial-section">
        <div className="section-header2" onClick={() => toggleSection('skills')}>
          <h2>Skills Section</h2>
          <FontAwesomeIcon 
            icon={expandedSections.skills ? faChevronUp : faChevronDown} 
            className="toggle-icon"
          />
        </div>
        {expandedSections.skills && (
          <div className="section-content">
            <h3>For Service Providers:</h3>
            <ol>
              <li>Add your skills in the profile section</li>
              <li>Set your hourly rate</li>
              <li>Specify your availability</li>
              <li>Add any relevant certifications</li>
            </ol>
            <h3>For Service Seekers:</h3>
            <ol>
              <li>Browse the Skills section to find providers</li>
              <li>Filter by skill, location, or rating</li>
              <li>View provider profiles</li>
              <li>Contact providers directly</li>
            </ol>
          </div>
        )}
      </div>

      <div className="tutorial-section">
        <div className="section-header2" onClick={() => toggleSection('jobs')}>
          <h2>Jobs Section</h2>
          <FontAwesomeIcon 
            icon={expandedSections.jobs ? faChevronUp : faChevronDown} 
            className="toggle-icon"
          />
        </div>
        {expandedSections.jobs && (
          <div className="section-content">
            <h3>Posting a Job:</h3>
            <ol>
              <li>Navigate to the Jobs section</li>
              <li>Click 'Post a Job'</li>
              <li>Fill in job details (title, description, budget, etc.)</li>
              <li>Submit the job posting</li>
            </ol>
            <h3>Applying for Jobs:</h3>
            <ol>
              <li>Browse available jobs</li>
              <li>Click on a job to view details</li>
              <li>Click 'Apply' if interested</li>
              <li>Submit your proposal</li>
            </ol>
          </div>
        )}
      </div>

      <div className="tutorial-footer">
        <p>Need more help? Visit our <Link to="/help">Help Center</Link> or <Link to="/contact">Contact Us</Link>.</p>
      </div>
    </div>
  );
};

export default Tutorial;