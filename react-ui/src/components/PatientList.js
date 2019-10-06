import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientlist.css';

import PatientCard from "./PatientCard";

function PatientList(props) {
  if (props.isFetching) {
    return (
        <p>Loading...</p>
    )
  } else if (props.patients === undefined || props.patients.length === 0) {
    return (
        <p>No device is connected</p>
    )
  }


  return(
    <div className='patient-list'>
      {props.patients.map((patient) => (
          <PatientCard key={patient._id}
                       _id={patient._id}
                       isConnected={patient.isConnected}
                       targetDripRate={patient.targetDripRate}
                       currentDripRate={patient.currentDripRate}
                       currentWeight={patient.currentWeight}
                       getPatientInformation={props.getPatientInformation}
                       idChangedCard={props.idChangedCard}

          />
      ))}
    </div>
  );

}

PatientList.propTypes = {
  patients: PropTypes.array,
  isFetching: PropTypes.bool,
  getPatientInformation: PropTypes.func,
  idChangedCard: PropTypes.string
};

export default PatientList;
