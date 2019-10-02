import React, {useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import '../css/editor.css';

function Editor(props){
  const [modified, setModified] = useState(false);

  const [patientInformation, setPatientInformation] = useState({
    id: props.id,
    lastName: props.information.lastName,
    firstName: props.information.firstName,
    middleName:props.information.middleName,
    age: props.information.age,
    weight: props.information.weight,
    height: props.information.height,
    gender: props.information.gender,
    comments: props.information.comments,
    dripFactor: props.dripFactor,
    targetDripRate: props.targetDripRate
  });

  function handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    patientInformation[name] = value;
    setPatientInformation(patientInformation);
    setModified(true);
  }

  function submitData() {
    if (!patientInformation.dripFactor) {
      alert('Drip Factor cannot be empty.')
    }

    if (!patientInformation.targetDripRate) {
      alert('Target Drip Rate cannot be empty.')
    }

    if (patientInformation.dripFactor && patientInformation.targetDripRate) {
      axios.post('/api/edit', patientInformation)
          .then(res => {
            if (res.status === 200) {
              setTimeout(() => {
                props.closeModal();
                props.triggerChange()
              }, 1000);
            } else if (res.status === 400) {
              alert('Something went wrong.')
            }
          }).catch(err => {
        console.log(err);
        alert(`Something went wrong. ${err}`)
      })
    }
  }

  return(
      <div>
        <form onSubmit={e => e.preventDefault()} autoComplete='off'>
          <div className='div-input'>
            <p className='label-input'>Last Name</p>
            <input type='text' name='lastName' defaultValue={patientInformation.lastName} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>First Name</p>
            <input type='text' name='firstName' defaultValue={patientInformation.firstName} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Middle Name</p>
            <input type='text' name='middleName' defaultValue={patientInformation.middleName} onChange={e => handleInputChange(e)}/>
          </div>


          <div className='div-input'>
            <p className='label-input'>Target Drip Rate (gtts)</p>
            <input type='number' name='targetDripRate' defaultValue={patientInformation.targetDripRate} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Drip Factor (gtts/mL)</p>
            <input type='number' name='dripFactor' defaultValue={patientInformation.dripFactor} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Age</p>
            <input type='number' name='age' defaultValue={patientInformation.age} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Gender</p>
            <input type='text' name='gender' defaultValue={patientInformation.gender} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Weight (kg)</p>
            <input type='number' name='weight' defaultValue={patientInformation.weight} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p className='label-input'>Height (cm)</p>
            <input type='number' name='height' defaultValue={patientInformation.height} onChange={e => handleInputChange(e)}/>
          </div>

          <div className='div-input'>
            <p>Comments</p>
            <textarea className='text-area-comment' name="comment" defaultValue={patientInformation.comments} onChange={e => handleInputChange(e)}/>
          </div>

          <button disabled={!modified} onClick={() => submitData()}>APPLY</button>
          <button className='button-close' onClick={() => props.closeModal()}>CANCEL</button>


        </form>
      </div>
  )
}

Editor.propTypes = {
  id: PropTypes.string,
  information: PropTypes.shape({
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    age: PropTypes.number,
    weight: PropTypes.number,
    gender: PropTypes.string,
    comments: PropTypes.string,
  }),
  dripFactor: PropTypes.number,
  targetDripRate: PropTypes.number,
  closeModal: PropTypes.func,
  triggerChange: PropTypes.func,
  //refreshCard: PropTypes.func
};

export default Editor;
