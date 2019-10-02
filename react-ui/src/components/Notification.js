import React from 'react';
import PropTypes from 'prop-types';

function Notification(props) {
  return(
      <div>

      </div>
  )
}

Notification.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  shouldTimeOut: PropTypes.bool
  //let notifs = [{type: '', title: '', content: '', shouldTimeOut: ''}];
};

export default Notification;
