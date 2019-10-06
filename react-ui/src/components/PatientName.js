import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientname.css';

function PatientName(props) {

  return(
      <div className='patient-name'>
        <div className='lastName'>{(props.lastName) ? props.lastName.toUpperCase() : props.id}</div>
        <div>{props.firstName} {props.middleName}</div>
      </div>
  )
}

PatientName.propTypes = {
  id: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  middleName: PropTypes.string
};

export default PatientName;
