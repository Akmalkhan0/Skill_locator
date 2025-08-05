import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import "../css/register.css";
import statesDistricts from "../data/indianStatesDistricts.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "seeker",
    profilePicture: null,
    bio: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    city: "",
    location: { lat: "", lng: "" },
    skills: "",
    category: "",
    hourlyRate: "",
    availabilityStartDay: "",
    availabilityEndDay: "",
    availabilityStartTime: "",
    availabilityEndTime: "",
    experience: "",
    certifications: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    addressLine1: false,
    city: false,
    state: false,
    district: false,
    pincode: false,
    category: false,
    skills: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    lengthValid: false
  });

  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (formData.state) {
      setDistricts(statesDistricts[formData.state] || []);
      setFormData(prev => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  useEffect(() => {
    const validateForm = () => {
      const {
        fullName, email, password, confirmPassword, phone,
        addressLine1, district, state, pincode, city,
        role, category, skills
      } = formData;

      // Password strength validation
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const lengthValid = password.length >= 8;
      setPasswordStrength({ hasUpper, hasLower, hasNumber, hasSpecial, lengthValid });

      // Field validation
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isPasswordValid = password === confirmPassword &&
        hasUpper && hasLower && hasNumber && hasSpecial && lengthValid;
      const isPhoneValid = phone.length >= 10;
      const isAddressValid = addressLine1 && district && state && pincode && city;

      setFieldErrors({
        fullName: !fullName,
        email: !isEmailValid,
        password: !isPasswordValid,
        confirmPassword: password !== confirmPassword,
        phone: !isPhoneValid,
        addressLine1: !addressLine1,
        city: !city,
        state: !state,
        district: !district,
        pincode: !pincode,
        category: role === 'provider' && !category,
        skills: role === 'provider' && !skills
      });

      const isBasicValid = fullName && isEmailValid && isPasswordValid && isPhoneValid && isAddressValid;

      // Role-specific validation
      if (role === "provider") {
        setIsFormValid(isBasicValid && category && skills);
      } else {
        setIsFormValid(isBasicValid);
      }
    };

    validateForm();
  }, [formData]);

  const [showProviderFields, setShowProviderFields] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "certifications") {
        setFormData({ ...formData, certifications: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({ ...formData, role });
    setShowProviderFields(role === "provider");
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/akmal786/upload", 

        {
          method: "POST",
          body: formData
        }
      );
      const data = await response.json();
      if (!data.secure_url) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const {
      fullName, email, password, confirmPassword, role,
      phone, profilePicture, bio,
      addressLine1, addressLine2, district, state, pincode, city,
      location, skills, category, hourlyRate,
      availabilityStartDay, availabilityEndDay, availabilityStartTime, availabilityEndTime, experience, certifications
    } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (role === "provider") {
      if (!category) {
        alert("Please select a service category!");
        return;
      }
      if (!skills) {
        alert("Please enter your skills!");
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Authentication successful, user created:", user.uid);

      let profilePictureUrl = null;
      if (profilePicture) {
        profilePictureUrl = await uploadToCloudinary(profilePicture);
      }

      let certificationUrls = [];
      if (certifications.length > 0) {
        certificationUrls = await Promise.all(
          certifications.map(file => uploadToCloudinary(file))
        );
      }

      const userData = {
        uid: user.uid,
        profile: {
          fullName: fullName.trim(),
          email: email.toLowerCase(),
          phone: phone.trim() || null,
          role,
          bio: bio?.trim() || null,
          address: `${addressLine1?.trim() || ''}, ${addressLine2?.trim() || ''}, ${city?.trim() || ''}, ${district?.trim() || ''}, ${state?.trim() || ''} - ${pincode?.trim() || ''}` || null,
          profilePicture: profilePictureUrl || null
        },
        account: {
          status: "active",
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          lastLocationUpdate: null
        },
        preferences: {
          notifications: true,
          language: "en",
          currency: "INR"
        }
      };

      if (role === "provider") {
        userData.provider = {
          services: {
            category,
            skills: skills.split(",")
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0),
            hourlyRate: parseFloat(hourlyRate) || 0,
            availability: `${availabilityStartDay.trim()} - ${availabilityEndDay.trim()} ${availabilityStartTime.trim()} To ${availabilityEndTime.trim()}` || null,
            experience: parseInt(experience) || 0
          },
          location: {
            address: `${addressLine1.trim()}, ${addressLine2.trim()}, ${city.trim()}, ${district.trim()}, ${state.trim()} - ${pincode.trim()}`,
            coordinates: {
              lat: parseFloat(location.lat) || null,
              lng: parseFloat(location.lng) || null
            },
            serviceArea: null
          },
          verification: {
            status: "pending",
            documents: certificationUrls,
            verifiedAt: null,
            rejectionReason: null
          },
          metrics: {
            rating: 0,
            totalRatings: 0,
            completedJobs: 0,
            responseRate: 0,
            cancelationRate: 0
          },
          business: {
            registrationNumber: null,
            taxId: null,
            insurance: null
          }
        };
      } else {
        userData.seeker = {
          savedProviders: [],
          searchHistory: [],
          bookingPreferences: {
            preferredCategories: [],
            maxPrice: null,
            preferredLocation: null
          }
        };
      }

      try {
        console.log("Attempting to save user data to Firestore...");
        console.log("User data being saved:", JSON.stringify(userData, null, 2));
        const userRef = doc(db, "users", user.uid);
        console.log("Attempting to save to Firestore at path:", userRef.path);
        console.log("User data being saved:", JSON.stringify(userData, null, 2));

        try {
          await setDoc(userRef, userData);
          const docSnapshot = await getDoc(userRef);
          if (!docSnapshot.exists()) {
            throw new Error("Firestore document was not created successfully");
          }
          console.log("User data successfully saved to Firestore");
          console.log("Document snapshot:", docSnapshot.data());
          alert("Registration successful! Please log in.");
          navigate("/login");
        } catch (firestoreError) {
          console.error("Detailed Firestore Error:", {
            code: firestoreError.code,
            message: firestoreError.message,
            stack: firestoreError.stack
          });
          throw new Error(`Failed to save user data: ${firestoreError.message}`);
        }
      } catch (firestoreError) {
        console.error("Firestore Error:", firestoreError);
        console.error("Error Code:", firestoreError.code);
        console.error("Error Message:", firestoreError.message);
        console.error("User Data That Failed:", JSON.stringify(userData, null, 2));
        try {
          await deleteUser(user);
          console.log("Rolled back auth user due to Firestore failure");
        } catch (deleteError) {
          console.error("Failed to rollback auth user:", deleteError);
        }
        throw new Error(`Registration failed: ${firestoreError.message}`);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-form" >
      <div className="app-header" >
        <h1>Skill Locator</h1>
        <p>Find and showcase your skills</p>
      </div>
      <h2>Register</h2>
      <p Style="color:#ff5500;">
        * please fill all the required Field to Register *
      </p>
      <form onSubmit={handleSubmit}>
      <div style={{ position: 'relative'}}>
          <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={`Inputbox ${fieldErrors.fullName ? 'error-border' : ''}`}
            style={{ paddingLeft: '35px' }}
          />
          {fieldErrors.fullName && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>Full name is required</span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`Inputbox ${fieldErrors.email ? 'error-border' : ''}`}
            style={{ paddingLeft: '35px' }}
          />
          {fieldErrors.email && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>Please enter a valid email</span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`Inputbox ${fieldErrors.password ? 'error-border' : ''}`}
            style={{ paddingLeft: '35px' }}
          />
          <div style={{ marginTop: '5px', marginLeft: '10px' }}>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              <span style={{ color: passwordStrength.hasUpper ? 'green' : 'red', fontSize: '12px' }}>Uppercase</span>
              <span style={{ color: passwordStrength.hasLower ? 'green' : 'red', fontSize: '12px' }}>Lowercase</span>
              <span style={{ color: passwordStrength.hasNumber ? 'green' : 'red', fontSize: '12px' }}>Number</span>
              <span style={{ color: passwordStrength.hasSpecial ? 'green' : 'red', fontSize: '12px' }}>Special</span>
              <span style={{ color: passwordStrength.lengthValid ? 'green' : 'red', fontSize: '12px' }}>8+ chars</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`Inputbox ${fieldErrors.confirmPassword ? 'error-border' : ''}`}
            style={{ paddingLeft: '35px' }}
          />
          {fieldErrors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>Passwords don't match</span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faPhone} style={{ position: 'absolute', left: '10px', top: '12px', color: '#ff5500' }} />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={`Inputbox ${fieldErrors.phone ? 'error-border' : ''}`}
            required
            style={{ paddingLeft: '35px' }}
          />
          {fieldErrors.phone && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>Valid phone number required</span>
          )}
        </div>

        <div style={{ marginTop: '10px' ,width:'100%' }}>
          <h4>Profile Picture</h4>
          <input
            type="file"
            name="profilePicture"
            onChange={handleChange}
            accept="image/*"
            className="Inputbox"
            id="profile-upload"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="profile-upload"
            className="Inputbox"
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #ff7b00, #ff5500)',
              borderRadius: '4px',
            }}
          >
            Select Profile Picture
          </label>
          {formData.profilePicture && (
            <div style={{ marginTop: '10px' }}>
              <p>Selected:</p>
              <img
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Profile Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #ff5500;' }}
              />
            </div>
          )}
        </div>

        <select name="role" value={formData.role} onChange={handleRoleChange} className="Inputbox">
          <option value="seeker">Seeker</option>
          <option value="provider">Provider</option>
        </select>
        {showProviderFields && (
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="Inputbox provider-in"
            >
              <option value="">Select a category</option>
              <option value="Plumber">Plumber</option>
              <option value="IT Sector">IT Sector</option>
              <option value="Software Development">Software Development</option>
              <option value="Web Development">Web Development</option>
              <option value="Civil Engineer">Civil Engineer</option>
              <option value="Architecture Designer">Architecture Designer</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="Photographer">Photographer</option>
              <option value="Interior Designer">Interior Designer</option>
              <option value="Gardener">Gardener</option>
              <option value="Painter">Painter</option>
              <option value="Tutor">Tutor</option>
            </select>
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              required
              className="Inputbox provider-in"

            />
            <input
              type="number"
              name="hourlyRate"
              placeholder="Hourly Rate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="Inputbox provider-in"

            />
            <select
              name="availabilityStartDay"
              value={formData.availabilityStartDay}
              onChange={handleChange}
              className="Inputbox provider-in"
              required
            >
              <option value="">Select Start Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <select
              name="availabilityEndDay"
              value={formData.availabilityEndDay}
              onChange={handleChange}
              className="Inputbox provider-in"
              required
            >
              <option value="">Select End Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input
              type="time"
              name="availabilityStartTime"
              placeholder="Start Time"
              value={formData.availabilityStartTime}
              onChange={handleChange}
              className="Inputbox provider-in"
              required
            />
            <input
              type="time"
              name="availabilityEndTime"
              placeholder="End Time"
              value={formData.availabilityEndTime}
              onChange={handleChange}
              className="Inputbox provider-in"
              required
            />
            <input
              type="number"
              name="experience"
              placeholder="Experience (years)"
              value={formData.experience}
              onChange={handleChange}
              className="Inputbox provider-in"

            />
            <div style={{ marginTop: '10px', }}>
              <h4>Upload Certifications</h4>
              <input
                type="file"
                name="certifications"
                multiple
                onChange={handleChange}
                accept="image/*"
                className="Inputbox provider-in"
                id="certification-upload"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="certification-upload"
                className="Inputbox"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  background: 'linear-gradient(to right, #ff7b00, #ff5500)',
                  borderRadius: '4px',
                }}
              >
                Select Multiple Certifications
              </label>

              {formData.certifications.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p>{formData.certifications.length} files selected:</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {formData.certifications.map((file, index) => (
                      <div key={index} style={{ width: '100px', height: '100px', position: 'relative' }}>
                        {file.type && file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '2px solid #000' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px'
                          }}>
                            <p style={{ textAlign: 'center', fontSize: '12px' }}>{file.name}</p>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newCertifications = [...formData.certifications];
                            newCertifications.splice(index, 1);
                            setFormData({ ...formData, certifications: newCertifications });
                          }}
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#101',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '15px',
                            height: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '15px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          className="Inputbox"
          required
        />
        <div style={{ position: 'relative' ,width:'100%'}}>
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`Inputbox ${fieldErrors.addressLine1 ? 'error-border' : ''}`}
            required
          />
          {fieldErrors.addressLine1 && (
            <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>Address line 1 is required</span>
          )}
        </div>
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2"
          value={formData.addressLine2}
          className="Inputbox"
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          className="Inputbox"
          onChange={handleChange}
          required
        />
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="Inputbox"
          required
        >
          <option value="">Select State</option>
          {Object.keys(statesDistricts).map(state => (
            <option className="Inputbox" key={state} value={state}>{state}</option>
          ))}
        </select>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="Inputbox"
          required
          disabled={!formData.state}
        >
          <option value="" className="Inputbox">Select District</option>
          {districts.map(district => (
            <option className="Inputbox" key={district} value={district}>{district}</option>
          ))}
        </select>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          className="Inputbox"
          onChange={handleChange}
          required
        />
        <button
          className="Inputbox"
          type="button"
          onClick={async () => {
            try {
              const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
              });
              setFormData({
                ...formData,
                location: {
                  lat: position.coords.latitude.toString(),
                  lng: position.coords.longitude.toString()
                }
              });
              alert('Location successfully fetched!');
            } catch (error) {
              console.error('Error getting location:', error);
              alert('Could not get your location. Please enable location services or enter manually.');
            }
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Get My Location
        </button>
        {formData.location.lat && formData.location.lng && (
          <p style={{ marginTop: '10px' }}>
            Location: {formData.location.lat}, {formData.location.lng}
          </p>
        )}
        <button
          type="submit"
          className="Inputbox"
          style={{
            padding: '8px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
            opacity: isUploading || !isFormValid ? 0.6 : 1
          }}
          disabled={!isFormValid || isUploading}
        >
          {isUploading ? 'Uploading... Please wait' : 'Register'}
        </button>

        {isUploading && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p>Uploading files to Cloudinary, please wait...</p>
          </div>
        )}
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
