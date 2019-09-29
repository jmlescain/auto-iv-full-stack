import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/details.css';

import back_button from '../assets/back.png';

function Details(props) {
  const [information, setInformation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (props.id !== '') {
      setIsLoading(true);
      axios.get(`/api/patient/${props.id}/full`)
          .then(response => {
            setInformation(response.data);
            setIsLoading(false);
          })
    }
  }, [props.id]);

  if (props.id === '') {
    return <div className='notice'><div>Select a patient to view</div></div>
  }

  if (isLoading === true) {
    return <div className='details'><div className='notice'>Loading...</div></div>
  }

  let {lastName, firstName, middleName, age, weight, gender, comments} = information;
  let currentDripRate = (props.dripData.currentDripRate) ? `${props.dripData.currentDripRate} gtts` : '0 gtts';
  let currentWeight = (props.dripData.currentWeight) ? `${props.dripData.currentWeight} mL` : '0 mL';
  let percentVolume = Math.trunc((props.dripData.currentWeight / 500) * 100);

  return(
      <div className='details'>
        <div className='name'>
          <div className='id'>{props.id}</div>
          {(lastName) ? <div className='lastName'>{lastName.toUpperCase()}</div> : <div className='noData'>NO DATA</div>}
          {(lastName || middleName) ? <div>{firstName} {middleName}</div> : <div>{'\u00A0'}</div>}
        </div>
        <div className='dripData'>
          <div>{currentDripRate}</div>
          <div className='volume'>
            <p>{currentWeight}</p>
            <p className='percentVolume'>{percentVolume} %</p>
          </div>
        </div>
        <div>{age && <p>Age: {age} Years Old</p>}</div>

        <div onClick={() => props.getPatientInformation('')}>
          <img src={back_button} alt='Back' title='Back' className='backButton'/>
        </div>
      </div>
  )
}

Details.propTypes = { //targetDripRate age weight height gender comments
  id: PropTypes.string,
  dripData: PropTypes.shape({
    currentDripRate: PropTypes.number,
    targetDripRate: PropTypes.number,
    currentWeight: PropTypes.number,
    isConnected: PropTypes.bool
  }),
  getPatientInformation: PropTypes.func
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
