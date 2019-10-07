import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/patientcard.css';

import PatientName from "./PatientName";
import DripData from "./DripData";
import MoreDetails from "./MoreDetails";
import Controls from "./Controls";

function PatientCard(props) {
  const [patientData, setPatientData] = useState({lastName: null, firstName: null, middleName: null});

  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    axios.get(`/api/patient/${props._id}`)
        .then((response) => {
          setPatientData(response.data);

        });
    if (hasChanged) setHasChanged(false);
  }, [hasChanged]);

  function refreshCard(){
    setHasChanged(true);
  }

  let {lastName, firstName, middleName} = patientData;

  const [expand, setExpand] = useState(false);
  function toggleMore(){
    if (expand === true) {
      setExpand(false);
    } else {
      setExpand(true);
    }
  }

  let connectionStatus = (!props.isConnected) ? <div className='connectionStatus'>Device is disconnected.</div> : null ;

  return (
      <div title='Click for more patient details' className='card' onClick={() => {toggleMore()}}>
        <PatientName id={props._id} lastName={lastName} firstName={firstName} middleName={middleName}/>
        {(expand) &&
          <MoreDetails id={props._id}/>
        }
        <DripData currentDripRate={props.currentDripRate}
                  currentWeight={props.currentWeight}
                  targetDripRate={props.targetDripRate}
                  dripFactor={props.dripFactor}
                  isExpanded={expand}
        />
        {connectionStatus}
        {(expand) &&
          <Controls id={props._id}
                    targetDripRate={props.targetDripRate}
                    dripFactor={props.dripFactor}
                    refreshCard={refreshCard}
          />
        }
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
  getPatientInformation: PropTypes.func,
  idChangedCard: PropTypes.string
};

export default PatientCard;
