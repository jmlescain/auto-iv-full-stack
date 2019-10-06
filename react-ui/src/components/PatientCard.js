import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/patientcard.css';

import PatientName from "./PatientName";
import DripData from "./DripData";

function PatientCard(props) {
  const [patientData, setPatientData] = useState({lastName: null, firstName: null, middleName: null});
  const [hasChanged, setHasChanged] = useState(false);
  /*useEffect(()=>{
    if (props.idChangedCard === props._id) setHasChanged(true);
  }, []);*/

  useEffect(() => {
    axios.get(`/api/patient/${props._id}`)
        .then((response) => {
          setPatientData(response.data);

        });
    if (hasChanged) setHasChanged(false);
  }, [hasChanged, props.idChangedCard]);

  let {lastName, firstName, middleName} = patientData;

  //IV Details


  let connectionStatus = (!props.isConnected) ? <div className='connectionStatus'>Device is disconnected.</div> : null ;

  return (
      <div title='Click for more patient details' className='card' onClick={() => {props.getPatientInformation(props._id)}}>
        <PatientName id={props._id} lastName={lastName} firstName={firstName} middleName={middleName}/>
        <DripData currentDripRate={props.currentDripRate}
                  currentWeight={props.currentWeight}
                  targetDripRate={props.targetDripRate}
                  dripFactor={props.dripFactor}
        />
        {connectionStatus}
      </div>
  )
}

PatientCard.propTypes = {
  _id: PropTypes.string,
  currentDripRate: PropTypes.number,
  currentWeight: PropTypes.number,
  targetDripRate: PropTypes.number,
  dripFactor: PropTypes.number,
  isConnected: PropTypes.bool,
  /*  iv: PropTypes.shape({
      targetDripRate: PropTypes.number,
      currentDripRate: PropTypes.number,
      currentWeight: PropTypes.number,
      estimatedWeightEmpty: PropTypes.number,
      isConnected: PropTypes.bool
    }),*/
  getPatientInformation: PropTypes.func,
  idChangedCard: PropTypes.string
};

export default PatientCard;
