import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Modal from "react-modal";

import edit_button from "../assets/edit.png";

import '../css/controls.css';

import Editor from "./Editor";

Modal.setAppElement('#root');

function Controls(props){

  const [showModal, setShowModal] = useState(false);

  const modalStyle = {
    content: {
      width: '90',
      margin: '0 1rem'
    }
  };

  function handleEdit(e) {
    e.stopPropagation();
    openModal();
  }
  function openModal() {
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false);
  }

  return(
      <div>
        <div className='buttonRow'>
          <img onClick={(e) => handleEdit(e)} src={edit_button} alt='Edit' title='Edit' className='editButton'/>
        </div>
        <Modal isOpen={showModal} ariaHideApp={false} closeTimeoutMS={200} shouldCloseOnOverlayClick={true} onRequestClose={closeModal} style={modalStyle}>
          <Editor id={props.id} targetDripRate={props.targetDripRate} dripFactor={props.dripFactor} closeModal={closeModal} refreshCard={props.refreshCard}/>
        </Modal>
      </div>
  )
}

Controls.propTypes = {
  id: PropTypes.string,
  dripFactor: PropTypes.number,
  targetDripRate: PropTypes.number,
  closeModal: PropTypes.func,
  refreshCard: PropTypes.func

};

export default Controls
