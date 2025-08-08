import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/profile.css";
import "../css/profile-viewer.css";
import Modal from 'react-modal';
import SEO from './SEO';
import { pageMeta } from '../config/seo.config';

Modal.setAppElement('#root');

const ProfileViewer = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userDoc = userSnap.data();
          setUserData({
            fullName: userDoc.profile?.fullName || "",
            profilePicture: userDoc.profile?.profilePicture || null,
            role: userDoc.profile?.role || "",
            bio: userDoc.profile?.bio || "",
            phone: userDoc.profile?.phone || "",
            email: userDoc.profile?.email || "",
            address: userDoc.profile?.address || "",
            services: userDoc.provider?.services || null,
            metrics: userDoc.provider?.metrics || null,
            certifications: userDoc.provider?.verification?.documents || []
          });
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="profile-container1">
        <header className="profile-header1 skeleton">
          <div className="profile-info1">
            <div className="profile-pic1 skeleton-circle"></div>
            <div>
              <div className="skeleton skeleton-text" style={{ display: 'block' }}></div>
              <div className="skeleton skeleton-capsule" style={{ display: 'inline-block' }}></div>
          </div>
            </div>
          <div className="skeleton skeleton-button"></div>
        </header>
        <div className="profile-sections1">
        <section className="profile-section1 personal-info1">
          <h3>Personal Information</h3>
          <div className="info-grid1">
            <div className="info-item1" style={{height:'140px'}}>
              <span className="info-label1">Email:</span>
              <span className="skeleton skeleton-text"></span>
            </div>
            <div className="info-item1" style={{height:'140px'}}>
              <span className="info-label1">Phone:</span>
              <span className="skeleton skeleton-text"></span>
            </div>
            <div className="info-item1" style={{height:'140px'}}>
              <span className="info-label1">Address:</span>
              <span className="info-value1 skeleton skeleton-line"></span>
              <span className="info-value1 skeleton skeleton-line short"></span>
            </div>
            <div className="info-item1">
              <span className="info-label1">Bio:</span>
              <span className="info-value1 skeleton skeleton-line"></span>
              <span className="info-value1 skeleton skeleton-line"></span>
              <span className="info-value1 skeleton skeleton-line"></span>
              <span className="info-value1 skeleton skeleton-line medium"></span>
            </div>
          </div>
        </section>

        <section className="profile-section1 provider-details1">
          <h3>Service Details</h3>
          <div className="info-grid1">
            <div className="info-item1">
              <span className="info-label1">Category:</span>
              <span className="info-value1 skeleton skeleton-line"></span>
            </div>
            <div className="info-item1">
              <span className="info-label1">Skills:</span>
              <div className="skills-container1">
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
                <span className="skill-capsule1 skeleton skeleton-capsule"></span>
              </div>
            </div>
            <div className="info-item1">
              <span className="info-label1">Rating:</span>
              <span className="info-value1 skeleton skeleton-line short"></span>
            </div>
          </div>
        </section>

        <section className="profile-section1 certificates1">
          <h3>Certifications</h3>
          <div className="certificates-grid1">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="certificate-item1">
                <div className="certificate-thumbnail1 skeleton skeleton-image"></div>
                <p className="certificate-title1 skeleton skeleton-text"></p>
                <p className="certificate-provider1 skeleton skeleton-text short"></p>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container1">
        <h3>{error}</h3>
        <button onClick={() => window.location.reload()} className="reload-button1">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={pageMeta.profileViewer.title}
        description={pageMeta.profileViewer.description}
        keywords={pageMeta.profileViewer.keywords}
      />
      <div className="profile-container1">
      <header className="profile-header1">
        <div className="profile-info1">
          {userData.profilePicture && (
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="profile-pic1"
            />
          )}
          <div>
            <h2>{userData.fullName || "User"}</h2>
            <p className="role-badge1">{userData.role === "provider" ? 'Service Provider' : 'Service Seeker'}</p>

          </div>
        </div>
{userData.role === "provider" && (
              <button
                className="request-chat-btn "


                onClick={() => {
                  alert("The Chat Request Opention Has been Under Development.");
                }}
              >
                Request Chat
              </button>
            )}
      </header>

      <div className="profile-sections1">
        <section className="profile-section1 personal-info1">
          <h3>Personal Information</h3>
          <div className="info-grid1">
            <div className="info-item1">
              <span className="info-label1">Email:</span>
              <span className="info-value1">{userData.email}</span>
            </div>
            <div className="info-item1">
              <span className="info-label1">Phone:</span>
              <span className="info-value1">{userData.phone || "Not Provided1"}</span>
            </div>
            <div className="info-item1">
              <span className="info-label1">Address:</span>
              <span className="info-value1">{userData.address || "Not Provided1"}</span>
            </div>
            <div className="info-item1">
              <span className="info-label1">Bio:</span>
              <span className="info-value1">{userData.bio || "No bio available1"}</span>
            </div>
          </div>
        </section>

        {userData.role === "provider" && (
          <>
            <section className="profile-section1 provider-details1">
              <h3>Service Details</h3>
              <div className="info-grid1">
                <div className="info-item1">
                  <span className="info-label1">Category:</span>
                  <span className="info-value1">{userData.services?.category || "Not specified"}</span>
                </div>
                <div className="info-item1">
                  <span className="info-label1">Skills:</span>
                  <div className="skills-container1">
                    {userData.services?.skills?.map((skill, index) => (
                      <span key={index} className="skill-capsule1">{skill.trim()}</span>
                    )) || "Not listed"}
                  </div>
                </div>
                <div className="info-item1">
                  <span className="info-label1">Rating:</span>
                  <span className="info-value1">{userData.metrics?.rating ? `${userData.metrics.rating.toFixed(1)} ★` : '0★'}</span>
                </div>
              </div>
            </section>

            {userData.certifications && userData.certifications.length > 0 && (
              <section className="profile-section1 certificates1">
                <h3>Certifications</h3>
                <div className="certificates-grid1">
                  {userData.certifications.map((cert, index) => {
                    const certUrl = cert?.url || cert;
                    const certName = cert?.name || `Certificate ${index + 1}`;
                    const providerName = cert?.provider || "Unknown Provider";

                    return (
                      <div
                        key={index}
                        className="certificate-item1"
                        onClick={() => {
                          setSelectedCert(cert);
                          setModalIsOpen(true);
                        }}
                      >
                        {certUrl && (
                          <img
                            src={certUrl}
                            alt={`Certificate ${index + 1}`}
                            className="certificate-thumbnail1"
                          />
                        )}
                        <p className="certificate-title1">{certName}</p>
                        <p className="certificate-provider1">{providerName}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  </>
  );
};

export default ProfileViewer;
