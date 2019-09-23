import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientcard.css';

function PatientCard(props){
  let dripDisplay;
  let nameDisplay;

  //Patient Details
  if (props.lastName === undefined) {
    nameDisplay = props._id;
  } else {
    nameDisplay = <div>
                    <div>{props.lastName}</div>
                    <div>{props.firstName} {props.middleName}</div>
                  </div>
  }

  //IV Details
  if (Object.entries(props.iv).length === 0 && props.iv.constructor === Object) {
    dripDisplay = 'NO DRIP DATA AVAILABLE'
  } else {
    let currentDripRate = (props.iv.currentDripRate === undefined) ? '0 gtts' : `${props.iv.currentDripRate} gtts`;
    let currentWeight = (props.iv.currentWeight === undefined) ? '0 g' : `${props.iv.currentWeight} g`;
    dripDisplay = <div>
                    <div>{currentDripRate}</div>
                    <div>{currentWeight}</div>
                  </div>
  }

  return (
      <div className='card'>
        <div>{nameDisplay}</div>
        <div>{dripDisplay}</div>
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
