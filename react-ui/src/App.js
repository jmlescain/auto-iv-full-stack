import React, { useState, useEffect } from 'react';

import PatientList from "./components/PatientList";

import './App.css';

let isDev = process.env.NODE_ENV !== 'production';
let ioOptions = {transports: ['websocket']};
if (isDev) {
  ioOptions = {}
}

const io = require('socket.io-client');
const socket = io('/client-web-app', ioOptions);

function App() {
  const [patientsFromServer, setPatientsFromServer] = useState({patients: [], isFetching: true});

  useEffect(() => {
    socket.on('values-basic', (data) => {
      setPatientsFromServer({patients: data, isFetching: false});
    });
  }, []);

  return (
      <div className='container'>
          <PatientList patients={patientsFromServer.patients}
                       isFetching={patientsFromServer.isFetching}
          />
      </div>
  );

}

export default App;
