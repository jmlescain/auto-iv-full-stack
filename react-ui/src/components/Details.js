import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';

import '../css/details.css';

import back_button from '../assets/back.png';
import edit_button from '../assets/edit.png';
import Editor from "./Editor";

Modal.setAppElement('#root');

function Details(props) {
  const [information, setInformation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    if (props.id !== '') {
      setIsLoading(true);
      axios.get(`/api/patient/${props.id}/full`)
          .then(response => {
            setInformation(response.data);
            setIsLoading(false);
          });
      if (hasChanged === true) {
        setHasChanged(false);
      }
    }
  }, [props.id, hasChanged]);

  const [showModal, setShowModal] = useState(false);

  const modalStyle = {
    content: {
      width: 'fit-content',
      margin: 'auto'
    }
  };

  function triggerChange(){
    setHasChanged(true);
    props.refreshCard(props.id);
    console.log('Triggered!')
  }

  function openModal() {
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false);
  }

  if (props.id === '') {
    return <div className='notice'><div>Select a patient to view</div></div>
  }

  if (isLoading === true) {
    return <div className='details'><div className='notice'>Loading...</div></div>
  }

  let {lastName, firstName, middleName, age, weight, height, gender, comments} = information;
  let currentDripRate = (props.dripData.currentDripRate) ? `${props.dripData.currentDripRate} gtts` : '0 gtts';
  let currentWeight = (props.dripData.currentWeight) ? `${props.dripData.currentWeight} mL` : '0 mL';
  if (props.dripData.currentWeight === -1) {
    currentWeight = 'NO IV PACK'
  }
  let dripFactor = (props.dripData.dripFactor) ? props.dripData.dripFactor : 0;
  let percentVolume = Math.trunc((props.dripData.currentWeight / 500) * 100);
  let targetDripRate = props.dripData.targetDripRate;
  let minutesRemaining = props.dripData.minutesRemaining;
  let displayTime = {};
  let displayText;
  displayTime.hour = Math.trunc(minutesRemaining / 60);
  displayTime.minutes = minutesRemaining % 60;
  if (displayTime.hour === 0) {
    displayText = `${displayTime.minutes} minutes`;
  } else if (displayTime.hour > 1) {
    displayText = `${displayTime.hour} hours and ${displayTime.minutes} minutes`;
  } else if (displayTime.hour === 1) {
    displayText = `${displayTime.hour} hour and ${displayTime.minutes} minutes`;
  }


  return(
      <div className='details'>
        <div className='name'>
          <div className='id'>{props.id}</div>
          {(lastName) ? <div className='lastName'>{lastName.toUpperCase()}</div> : <div className='noData'>NO DATA</div>}
          {(lastName || middleName) ? <div>{firstName} {middleName}</div> : <div>{'\u00A0'}</div>}
        </div>
        <div className='dripData'>
          <div className='volume'>
            <p>{currentDripRate}</p>
            <p className='target'><br/>Target: {targetDripRate} ggts</p>
          </div>
          <div className='volume'>
            <p>{currentWeight}</p>
            <p className='percentVolume' title={`Drip Factor: ${dripFactor} gtts/mL`}>{percentVolume} % <br/> {displayText} until empty</p>
          </div>
        </div>
        <div className='genderAge'>
          <div>{gender && <p>Gender: <span style={{fontWeight: 'bold'}}>{gender}</span></p>}</div>
          <div>{age && <p>Age: <span style={{fontWeight: 'bold'}}>{age} Years Old</span></p>}</div>
        </div>
        <div className='weightHeight'>
          <div>{weight && <p>Weight:<span style={{fontWeight: 'bold'}}>{weight} kg</span></p>}</div>
          <div>{height && <p>Height: <span style={{fontWeight: 'bold'}}>{age} cm</span></p>}</div>
        </div>
        <div>{comments && <p>Notes: <span style={{fontWeight: 'bold'}}>{comments}</span></p>}</div>

        <div className='buttonRow'>
          <img onClick={() => props.getPatientInformation('')} src={back_button} alt='Back' title='Back' className='backButton'/>
          <img onClick={() => openModal()} src={edit_button} alt='Edit' title='Edit' className='editButton'/>
        </div>
        <Modal isOpen={showModal} ariaHideApp={false} closeTimeoutMS={200} shouldCloseOnOverlayClick={true} onRequestClose={closeModal} style={modalStyle}>
          <Editor id={props.id} information={information} targetDripRate={targetDripRate} dripFactor={dripFactor} closeModal={closeModal} triggerChange={triggerChange}/>
        </Modal>
      </div>
  )
}

Details.propTypes = { //targetDripRate age weight height gender comments
  id: PropTypes.string,
  dripData: PropTypes.shape({
    currentDripRate: PropTypes.number,
    targetDripRate: PropTypes.number,
    currentWeight: PropTypes.number,
    isConnected: PropTypes.bool,
    minutesRemaining: PropTypes.number,
    dripFactor: PropTypes.number
  }),
  getPatientInformation: PropTypes.func,
  refreshCard: PropTypes.func
  /*_id: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  middleName: PropTypes.string,
  age: PropTypes.number,
  weight: PropTypes.number,
  gender: PropTypes.string,
  comments: PropTypes.string,
  iv: PropTypes.shape({
    targetDripRate: PropTypes.number,
    currentDripRate: PropTypes.number,
    currentWeight: PropTypes.number,
    estimatedWeightEmpty: PropTypes.number,
    isConnected: PropTypes.bool
  })*/
};

export default Details;
