import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/patientcard.css';

function PatientCard(props){
  const [patientData, setPatientData] = useState({lastName: null, firstName: null, middleName: null});
  axios.get(`/api/patient/${props._id}`)
      .then((response) => {
        //setPatientData(response.data);
      });

  let {lastName, firstName, middleName} = patientData;
  console.log(lastName);

  //Patient Details
  let nameDisplay;
  if (lastName === null) {
    nameDisplay = <div className='lastName'>{props._id}</div>
  } else {
    nameDisplay = <div>
                    <div className='lastName'>{lastName}</div>
                    <div>{firstName} {middleName}</div>
                  </div>
  }

  //IV Details

    let currentDripRate = (props.currentDripRate === undefined) ? '0 gtts' : `${props.currentDripRate} gtts`;
    let currentWeight = (props.currentWeight === undefined) ? '0 g' : `${props.currentWeight} g`;

 let connectionStatus = (!props.isConnected) ? 'Device is disconnected' : null ;

  return (
      <div className='card' onClick={() => {props.getPatientInformation(props._id)}}>
        <div className='nameDisplay'>{nameDisplay}</div>
        <div className='dripDisplay'>
          <div>{currentDripRate}</div>
          <div>{currentWeight}</div>
        </div>
        <div className='connectionStatus'>{connectionStatus}</div>
      </div>
  )
}

PatientCard.propTypes = {
  _id: PropTypes.string,
  currentDripRate: PropTypes.number,
  currentWeight: PropTypes.number,
  targetDripRate: PropTypes.number,
  isConnected: PropTypes.bool,
/*  iv: PropTypes.shape({
    targetDripRate: PropTypes.number,
    currentDripRate: PropTypes.number,
    currentWeight: PropTypes.number,
    estimatedWeightEmpty: PropTypes.number,
    isConnected: PropTypes.bool
  }),*/
  getPatientInformation: PropTypes.func
};

export default PatientCard;
