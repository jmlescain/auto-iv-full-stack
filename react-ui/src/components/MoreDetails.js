import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

import '../css/moredetails.css';

function MoreDetails(props){

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

  let {age, weight, height, gender, comments, targetDripRate, dripFactor} = information;

  if (isLoading) {
    return(
        <p>Loading...</p>
    )
  }

  return(
      <div className='moreDetails'>
        {(!age && !weight && !height && !gender && !comments) &&
            <p>No Additional Data</p>
        }
        <div className='containerMoreDetails'>
          <div>
            <div>
              <div>{gender && <p>Gender: <span style={{fontWeight: 'bold'}}>{gender}</span></p>}</div>
              <div>{age && <p>Age: <span style={{fontWeight: 'bold'}}>{age} y/o</span></p>}</div>
            </div>
            <div>
              <div>{weight && <p>Weight:<span style={{fontWeight: 'bold'}}>{weight} kg</span></p>}</div>
              <div>{height && <p>Height: <span style={{fontWeight: 'bold'}}>{height} cm</span></p>}</div>
            </div>
            <div>{comments && <p>Notes: <span style={{fontWeight: 'bold'}}>{comments}</span></p>}</div>
          </div>
          <div>
            <div>
              <div>{targetDripRate && <p>Target: <span style={{fontWeight: 'bold'}}>{targetDripRate} gtts</span></p>}</div>
              <div>{dripFactor && <p>Factor: <span style={{fontWeight: 'bold'}}>{dripFactor} gtts/mL</span></p>}</div>
            </div>
          </div>
        </div>

      </div>
  )
}

MoreDetails.propTypes = {
  id: PropTypes.string,
  // lastName: PropTypes.string,
  // firstName: PropTypes.string,
  // middleName: PropTypes.string,
  // age: PropTypes.number,
  // weight: PropTypes.number,
  // height: PropTypes.number,
  // gender: PropTypes.number,
  // comments: PropTypes.number
};


export default MoreDetails;
