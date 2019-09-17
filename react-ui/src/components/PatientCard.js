import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientcard.css';

function PatientCard(props){
  return (
      <div className='card'>
        <p>{props.lastName}</p>
        <p>{props.firstName} {props.middleName}</p>
      </div>
  )
}

PatientCard.propTypes = {
  _id: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  middleName: PropTypes.string,
  iv: PropTypes.shape({
    targetDripRate: PropTypes.number,
    currentDripRate: PropTypes.number,
    currentWeight: PropTypes.number,
    estimatedWeightEmpty: PropTypes.number
  })
};

export default PatientCard;
