import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import emptyAlertAudio from '../assets/empty_alert.mp3';

import '../css/timeremainingnotifier.css';

function TimeRemainingNotifier(props) {
  const [alarm] = useState(new Audio(emptyAlertAudio));
  const [style, setStyle] = useState('timeRemainingNotifierSteady');
  useEffect(() => {
    if (props.minutesRemaining <= 5) {
      setStyle('timeRemainingNotifier');
      alarm.loop = true;
      alarm.play();
    } else {
      setStyle('timeRemainingNotifierSteady');
      alarm.pause();
    }
  }, [props.minutesRemaining]);

  return(
      <div className={style}>
        {props.minutesRemaining} {(props.minutesRemaining > 1) ? 'minutes' : 'minute' } until empty
      </div>
  )
}

TimeRemainingNotifier.propTypes = {
  minutesRemaining: PropTypes.number,
  isExpanded: PropTypes.bool
};

export default TimeRemainingNotifier;
