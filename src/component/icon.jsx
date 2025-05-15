import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faImage,
  faFileUpload,
  faSignInAlt,
  faUserPlus,
  faHome,
  faSearch,
  faBriefcase,
  faMoneyBillWave,
  faCalendarAlt,
  faCertificate,
  faSignOutAlt,
  faSpinner,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faImage,
  faFileUpload,
  faSignInAlt,
  faUserPlus,
  faHome,
  faSearch,
  faBriefcase,
  faMoneyBillWave,
  faCalendarAlt,
  faCertificate,
  faSignOutAlt,
  faMapMarkerAlt,
  faSpinner
);

const Icon = ({ name, ...props }) => {
  return <FontAwesomeIcon icon={name} {...props} />;
};

export default Icon;