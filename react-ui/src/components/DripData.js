import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import "../css/dripdata.css";

import icon_down from "../assets/down.png";
import icon_up from "../assets/up.png";
import icon_correct from "../assets/okay.png";

import targetDripOffAlertAudio from "../assets/drip_alert.ogg";
import TimeRemainingNotifier from "./TimeRemainingNotifier";

function DripData(props){

  const [currentDripRate, setCurrentDripRate] = useState('');
  useEffect(()=>{
    setCurrentDripRate((props.currentDripRate === undefined) ? '0 gtts' : `${props.currentDripRate} gtts`);
  }, [props.currentDripRate]);


  const [currentWeight, setCurrentWeight] = useState('');
  useEffect(()=>{
    if (props.currentWeight === undefined) {
      setCurrentWeight('0 mL');
    } else if (props.currentWeight === -1) {
      setCurrentWeight('NO IV');
    } else {
      setCurrentWeight(`${props.currentWeight} mL`);
    }
  }, [props.currentWeight]);


  const [audioDrip] = useState(new Audio(targetDripOffAlertAudio));
  const [arrowDirection, setArrowDirection] = useState(icon_correct);
  const [shouldBlink, setShouldBlink] = useState(false);
  useEffect(() => {
    if (props.currentDripRate > props.targetDripRate + 3) {
      setArrowDirection(icon_down);
      setShouldBlink(true);
      audioDrip.loop = true;
      audioDrip.play();
    } else if (props.currentDripRate < props.targetDripRate - 3) {
      setArrowDirection(icon_up);
      setShouldBlink(true);
      audioDrip.loop = true;
      audioDrip.play();
    } else {
      setShouldBlink(false);
      setArrowDirection(icon_correct);
      audioDrip.pause();
    }
  }, [props.currentDripRate, props.targetDripRate]);

  const [minutesRemaining, setMinutesRemaining] = useState(999999);
  useEffect(() => {
    setMinutesRemaining(Math.trunc(props.currentWeight / (props.currentDripRate / props.dripFactor)));
  }, [props.currentDripRate, props.currentWeight, props.dripFactor]);


  return(
      <div>
        <div className='dripDisplay'>
          <div className={ (shouldBlink) ? 'divDripRate blinkDrip' : 'divDripRate'}>
            <img src={arrowDirection} alt='drip_icon' className='dripIcon'/>{currentDripRate}
          </div>
          <div>{currentWeight}</div>
        </div>
        <div>
          <TimeRemainingNotifier minutesRemaining={minutesRemaining} />
        </div>
      </div>
  )
}

DripData.propTypes = {
  currentDripRate: PropTypes.number,
  currentWeight: PropTypes.number,
  targetDripRate: PropTypes.number,
  dripFactor: PropTypes.number
};

export default DripData;
