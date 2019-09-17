import React from 'react';
import PropTypes from 'prop-types';

import '../css/patientlist.css';
import PatientCard from "./PatientCard";

function PatientList(props) {
  if (props.isFetching) {
    return (
        <p>Loading...</p>
    )
  }

  return(
    <div>
      {props.patients.map((patient) => (
          <PatientCard key={patient._id}
                       _id={patient._id}
                       lastName={patient.lastName}
                       firstName={patient.firstName}
                       middleName={patient.middleName}
                       iv={patient.iv}

          />
      ))}
    </div>
  );

}

PatientList.propTypes = {
  patients: PropTypes.array,
  isFetching: PropTypes.bool
};

export default PatientList;
