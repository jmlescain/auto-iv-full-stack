import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/details.css';

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
    return <div className='notice'>Loading...</div>
  }

  let {lastName, firstName, middleName, age, weight, gender, comments} = information;

  return(
      <div className='details'>
        <div>{props.id}</div>
        <div>{lastName}</div>
        <div>{firstName} {middleName}</div>
        <div>Age: {age} Years Old</div>
      </div>
  )
}

Details.propTypes = { //targetDripRate age weight height gender comments
  id: PropTypes.string
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
