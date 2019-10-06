import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import emptyAlertAudio from '../assets/empty_alert.mp3';

import '../css/timeremainingnotifier.css';

function TimeRemainingNotifier(props) {
  const [alarm] = useState(new Audio(emptyAlertAudio));
  useEffect(() => {
    if (props.minutesRemaining <= 5) {
      alarm.loop = true;
      alarm.play();
    } else {
      alarm.pause();
    }
  });
  if (props.minutesRemaining > 5) return null;

  return(
      <div className='timeRemainingNotifier'>
        {props.minutesRemaining} {(props.minutesRemaining > 1) ? 'minutes' : 'minute' } until empty
      </div>
  )
}

TimeRemainingNotifier.propTypes = {
  minutesRemaining: PropTypes.number
};

export default TimeRemainingNotifier;
