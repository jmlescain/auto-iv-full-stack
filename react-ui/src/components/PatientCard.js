import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactNotification, { store } from 'react-notifications-component';

import '../css/patientcard.css';

import icon_up from '../assets/up.png';
import icon_down from '../assets/down.png';
import icon_correct from '../assets/okay.png';

import dripAlert from '../assets/drip_alert.ogg';
import notifAlert from '../assets/notif.mp3';

function PatientCard(props) {
  const [audioDrip] = useState(new Audio(dripAlert));
  const [audioAlert] = useState(new Audio(notifAlert));
  const [patientData, setPatientData] = useState({lastName: null, firstName: null, middleName: null});
  const [hasChanged, setHasChanged] = useState(false);
  /*useEffect(()=>{
    if (props.idChangedCard === props._id) setHasChanged(true);
  }, []);*/

  useEffect(() => {
    axios.get(`/api/patient/${props._id}`)
        .then((response) => {
          setPatientData(response.data);

          //notifier if patient has no last name
          if (!response.data.lastName) {
            audioAlert.play();
            store.addNotification({
              title: "No Name",
              message: `Please set a last name for ${response.data._id}`,
              type: "info",
              insert: "bottom",
              container: "bottom-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 0
              }
            });
          }
        });
    if (hasChanged) setHasChanged(false);
  }, [hasChanged, props.idChangedCard]);

  let {lastName, firstName, middleName} = patientData;

  //Patient Details
  let nameDisplay;
  if (!lastName) {
    nameDisplay = <div className='lastName'>{props._id}</div>;
  } else {
    nameDisplay = <div>
      <div className='lastName'>{lastName.toUpperCase()}</div>
      <div>{firstName} {middleName}</div>
    </div>
  }

  //IV Details
  let currentDripRate = (props.currentDripRate === undefined) ? '0 gtts' : `${props.currentDripRate} gtts`;
  let currentWeight;
  if (props.currentWeight === undefined) {
    currentWeight = '0 mL';
  } else if (props.currentWeight === -1) {
    currentWeight = 'NO IV'
  } else {
    currentWeight = `${props.currentWeight} mL`
  }

  let connectionStatus = (!props.isConnected) ? <div className='connectionStatus'>Device is disconnected.</div> : null ;

  let arrow;
  let cardClass = 'card';
  if (props.currentDripRate > props.targetDripRate + 3) {
    arrow = icon_down;
    cardClass = 'cardAlert';
    audioDrip.loop = true;
    audioDrip.play();
  } else if (props.currentDripRate < props.targetDripRate - 3) {
    arrow = icon_up;
    cardClass = 'cardAlert';
    audioDrip.loop = true;
    audioDrip.play();
  } else {
    arrow = icon_correct;
    cardClass = 'card';
    audioDrip.pause();
  }

  return (
      <div title='Click for more patient details' className={cardClass} onClick={() => {props.getPatientInformation(props._id)}}>
        <div className='nameDisplay'>{nameDisplay}</div>
        <div className='dripDisplay'>
          <div><img src={arrow} alt='drip_icon' className='dripIcon'/>{currentDripRate}</div>
          <div>{currentWeight}</div>
        </div>
        {connectionStatus}
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
  getPatientInformation: PropTypes.func,
  idChangedCard: PropTypes.string
};

export default PatientCard;
