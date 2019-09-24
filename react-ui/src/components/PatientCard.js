import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientcard.css';

function PatientCard(props){
  let dripDisplay;
  let nameDisplay;
  let currentDripRate;
  let currentWeight;
  let connectionStatus;

  //Patient Details
  if (props.lastName === undefined) {
    nameDisplay = <div className='lastName'>{props._id}</div>
  } else {
    nameDisplay = <div>
                    <div className='lastName'>{props.lastName}</div>
                    <div>{props.firstName} {props.middleName}</div>
                  </div>
  }

  //IV Details
  if (Object.entries(props.iv).length === 0 && props.iv.constructor === Object) {
    dripDisplay = 'NO DRIP DATA AVAILABLE'
  } else {
    currentDripRate = (props.iv.currentDripRate === undefined) ? '0 gtts' : `${props.iv.currentDripRate} gtts`;
    currentWeight = (props.iv.currentWeight === undefined) ? '0 g' : `${props.iv.currentWeight} g`;
  }

  if (!props.iv.isConnected) {
    connectionStatus = 'Device is disconnected';
  }

  return (
      <div className='card' onClick={() => {props.getPatientInformation(props._id)}}>
        <div className='nameDisplay'>{nameDisplay}</div>
        <div className='dripDisplay'>
          <div>{dripDisplay}</div>
          <div>{currentDripRate}</div>
          <div>{currentWeight}</div>
        </div>
        <div className='connectionStatus'>{connectionStatus}</div>
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
    estimatedWeightEmpty: PropTypes.number,
    isConnected: PropTypes.bool
  }),
  getPatientInformation: PropTypes.func
};

export default PatientCard;
