import React from 'react';
import Notification from "./Notification";
import PropTypes from 'prop-types';

function NotifList(props) {
  return(
      <div>
        {props.notifs.map((notif, index) => (
          <Notification key={index}/>

          ))}

      </div>
  )
}

NotifList.propTypes = {
  notifs: PropTypes.array
};

export default NotifList;
