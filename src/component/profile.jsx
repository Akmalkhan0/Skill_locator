import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../css/profile.css";
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPersonalInfoEdit, setShowPersonalInfoEdit] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userDoc = userSnap.data();
            console.log("User data loaded:", userDoc);

            const flatData = {
              uid: userDoc.uid,
              fullName: userDoc.profile?.fullName || "",
              email: userDoc.profile?.email || "",
              phone: userDoc.profile?.phone || "",
              role: userDoc.profile?.role || "seeker",
              bio: userDoc.profile?.bio || "",
              address: userDoc.profile?.address || "",
              accountStatus: userDoc.account?.status || "",
              emailVerified: userDoc.account?.emailVerified || false,
              createdAt: userDoc.account?.createdAt || null,
              lastLogin: userDoc.account?.lastLogin || null,
              profilePicture: userDoc.profile?.profilePicture || null,
              notifications: userDoc.preferences?.notifications || true,

              services: userDoc.provider?.services || null,
              location: userDoc.provider?.location || null,
              verification: userDoc.provider?.verification || null,
              metrics: userDoc.provider?.metrics || null,
              business: userDoc.provider?.business || null,

              savedProviders: userDoc.seeker?.savedProviders || [],
              searchHistory: userDoc.seeker?.searchHistory || [],
              bookingPreferences: userDoc.seeker?.bookingPreferences || {},
            };

            setUserData(flatData);
          } else {
            console.error("No user document found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.warn("User not logged in, redirecting to login.");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'ml_default');

      const response = await fetch(
        'Cloudinary_URL',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      if (!data.secure_url) throw new Error('Upload failed');

      // Update Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        'profile.profilePicture': data.secure_url
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        profilePicture: data.secure_url
      }));

      setShowPhotoEdit(false);
      setSelectedFile(null);

      // Force refresh of profile picture in header
      window.location.reload();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <header className="profile-header">
          <div className="profile-info">
            <div className="profile-pic1 skeleton skeleton-circle">
            </div>
            <div className="text-skeletons">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-capsule"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          </div>
          <div className="skeleton skeleton-button"></div>
        </header>

        <div className="profile-sections">
          <section className="profile-section personal-info">
            <div className="section-header">
              <div className="skeleton skeleton-text skeleton-text"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
            <div className="info-grid">
              {Array(4).fill(0).map((_, i) => (
                <div className="info-item" key={i}>
                  <div className="skeleton skeleton-line short"></div>
                  <div className="skeleton skeleton-line medium"></div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section dashboard-placeholder">
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-subtext"></div>
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-capsule" style={{display: 'inline-block', margin:'10px 0 10px 10px'}}></div>
            <div className="skeleton skeleton-circle-sm" style={{display: 'inline-block', marginBottom:'10px'}}></div>
            <div className="skeleton skeleton-line short"></div>
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-line short"></div>
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-line short"></div>
            <div className="skeleton skeleton-line medium"></div>
          </section>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <h3>Unable to Load Profile</h3>
        <p>We couldn't load your profile data. This could be because:</p>
        <ul className="error-reasons">
          <li>Your internet connection is unstable</li>
          <li>Our servers are temporarily unavailable</li>
          <li>Your profile data hasn't been properly initialized</li>
        </ul>

        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="reload-button">
            <i className="refresh-icon"></i> Try Again
          </button>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <i className="logout-icon"></i> Logout & Try Again
          </button>
        </div>

        <p className="error-help-text">
          If the problem continues, please contact support at support@skilllocator.com
        </p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-info">
          {userData.profilePicture && (
            <div className="profile-pic-container">
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="profiles-pic"
              />
              <button
                className="edit-profile-pic-btn"
                onClick={() => setShowPhotoEdit(true)}
              >
                Edit
              </button>

              <Modal
                isOpen={showPhotoEdit}
                onRequestClose={() => setShowPhotoEdit(false)}
                className="modal"
                overlayClassName="overlay"
              >
                <div className="modal-content">
                  <h3>Update Profile Picture</h3>

                  {!selectedFile ? (
                    <div className="file-selection-container">
                      <p className="file-selection-text">Select a new profile photo:</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="file-input"
                        id="profile-pic-input"
                      />
                      <label htmlFor="profile-pic-input" className="file-input-label">
                        Choose Photo
                      </label>
                    </div>
                  ) : (
                    <div className="preview-section">
                      <div className="preview-container">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="preview-image"
                        />
                      </div>
                      <div className="confirmation-text">
                        <p>Do you want to use this photo as your profile picture?</p>
                      </div>
                      <div className="modal-actions">
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="back-btn"
                        >
                          Choose Different Photo
                        </button>
                        <button
                          onClick={handlePhotoUpload}
                          disabled={uploading}
                          className="upload-btn"
                        >
                          {uploading ? 'Uploading...' : 'Yes, Use This Photo'}
                        </button>
                      </div>
                    </div>
                  )}

                  {!selectedFile && (
                    <div className="modal-actions">
                      <button
                        onClick={() => setShowPhotoEdit(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </Modal>
            </div>
          )}
          <div>
            <h2>Welcome, {userData.fullName || "User"}!</h2>
            <p className="role-badge">{userData.role === "provider" ? 'Service Provider' : 'Service Seeker'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="profile-sections">
        <section className="profile-section personal-info">
          <div className="section-header">
            <h3>Personal Information</h3>
            <button
              className="edit-btn"
              onClick={() => setShowPersonalInfoEdit(true)}
            >
              Edit
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{userData.phone || "Not Provided"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">{userData.address || "Not Provided"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bio:</span>
              <span className="info-value">{userData.bio || "No bio available"}</span>
            </div>
          </div>

          <PersonalInfoModal
            isOpen={showPersonalInfoEdit}
            onClose={() => setShowPersonalInfoEdit(false)}
            userData={userData}
          />
        </section>

        {userData.role === "provider" ? (
          <ProviderDashboard user={userData} />
        ) : (
          <SeekerDashboard user={userData} />
        )}
      </div>
    </div>
  );
};

// 💼 Provider Dashboard
const ProviderDashboard = ({ user }) => {
  const [showSkillModal, setShowSkillModal] = useState(false);

  const handleRemoveSkill = async (index) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedSkills = [...user.services?.skills || []];
      updatedSkills.splice(index, 1);
      await updateDoc(userRef, {
        'provider.services.skills': updatedSkills
      });
      window.location.reload();
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };

  return (
    <section className="profile-section provider-details">
      <h3>Service Details</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Category:</span>
          <span className="info-value">{user.services?.category || "Not specified"}</span>
        </div>
        <div className="info-item">
          <div className="skills-header">
            <span className="info-label">Skills:</span>
            <button
              className="add-skill-btn"
              onClick={() => setShowSkillModal(true)}
            >
              Add new Skills
            </button>
          </div>
          <div className="skills-container">
            {user.services?.skills?.map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-capsule">{skill.trim()}</span>
                <button
                  className="remove-skill-btn"
                  onClick={() => handleRemoveSkill(index)}
                >
                  ×
                </button>
              </div>
            )) || "Not listed"}
          </div>
        </div>

        <SkillModal
          isOpen={showSkillModal}
          onClose={() => setShowSkillModal(false)}
          userData={user}
        />
        <div className="info-item">
          <span className="info-label">Hourly Rate:</span>
          <span className="info-value">₹{user.services?.hourlyRate || "N/A"}/hr</span>
        </div>
        <div className="info-item">
          <span className="info-label">Availability:</span>
          <span className="info-value">{user.services?.availability || "Not specified"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Experience:</span>
          <span className="info-value">
            {user.services?.experience
              ? `${user.services.experience} years`
              : "Not specified"}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Location:</span>
          <span className="info-value">{user.location?.address || "Not specified"}</span>
        </div>
      </div>

      {user.verification?.documents?.length > 0 && (
        <div className="certifications-section">
          <h4>Certifications</h4>
          <div className="certifications-grid">
            {user.verification.documents.map((url, index) => (
              <div key={index} className="certification-item">
                <img
                  src={url}
                  alt="Certification"
                  className="certification-img"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

// 🔍 Seeker Dashboard
const SeekerDashboard = ({ user }) => {
  return (
    <section className="profile-section seeker-actions">
      <h3>Quick Actions</h3>
      <div className="action-buttons">
        <Link
          className="primary-action"
          to="/Home"
        >
          Find Service Providers
        </Link>
        <button
          className="secondary-action"
          onClick={() => alert("Saved providers coming soon!")}
        >
          View Saved Providers
        </button>
      </div>

      <div className="preferences-section">
        <h4>Your Preferences</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Preferred Categories:</span>
            <span className="info-value">
              {user.bookingPreferences?.preferredCategories?.join(", ") || "Not specified"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Max Price:</span>
            <span className="info-value">
              {user.bookingPreferences?.maxPrice ? `₹${user.bookingPreferences.maxPrice}` : "Not specified"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const PersonalInfoModal = ({ isOpen, onClose, userData }) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName,
    phone: userData.phone,
    bio: userData.bio,
    address: userData.address
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", userData.uid);
      await updateDoc(userRef, {
        'profile.fullName': formData.fullName,
        'profile.phone': formData.phone,
        'profile.bio': formData.bio,
        'profile.address': formData.address
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Edit Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="Modal-InputBox"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="Modal-InputBox"
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

const SkillModal = ({ isOpen, onClose, userData }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const userRef = doc(db, "users", userData.uid);
      const updatedSkills = [...(userData.services?.skills || []), newSkill.trim()];
      await updateDoc(userRef, {
        'provider.services.skills': updatedSkills
      });
      setNewSkill('');
      window.location.reload();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleRemoveSkill = async (index) => {
    try {
      const userRef = doc(db, "users", userData.uid);
      const updatedSkills = [...userData.services?.skills || []];
      updatedSkills.splice(index, 1);
      await updateDoc(userRef, {
        'provider.services.skills': updatedSkills
      });
      window.location.reload();
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Manage Skills</h2>
      <div className="skill-input">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add new skill"
          className="Modal-InputBox"
        />
        <button type="button" onClick={handleAddSkill}>Add</button>
      </div>
      <div className="skills-list">
        {userData.services?.skills?.map((skill, index) => (
          <div key={index} className="skill-item">
            <span>{skill}</span>
            <button onClick={() => handleRemoveSkill(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

const ProfilePhotoModal = ({ isOpen, onClose, userData }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "ml_default");

      const response = await fetch(
        "Cloudinay_URL",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.secure_url) {
        const userRef = doc(db, "users", userData.uid);
        await updateDoc(userRef, {
          'profile.profilePicture': data.secure_url
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Update Profile Photo</h2>
      <div className="file-upload">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {selectedFile && (
          <div className="preview">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="preview-img"
            />
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="button" onClick={handleUpload}>Upload</button>
      </div>
    </Modal>
  );
};

export default Profile;
