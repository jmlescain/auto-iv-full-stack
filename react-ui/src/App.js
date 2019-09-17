import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [patientList, setPatientList] = useState({patients: [], isFetching: false});
  useEffect(() => {
    setPatientList({patients: patientList.patients, isFetching: true});
    axios.get('/api/patient')
        .then(response => {
          setPatientList({patients: response.data, isFetching: false});
        })
  }, []);

  const [iv, setIv] = useState({});

  socket.on('values-basic', data => {
    console.log(data)
  });


  return (
      <div className='container'>
        <div className='patient-list'>
          <PatientList patients={patientList.patients} isFetching={patientList.isFetching}/>
        </div>
        <div className='details'>
          <p>Details</p>
        </div>
        <div className='notifications'>
          <p>Notifications</p>
        </div>
      </div>
  );

}

export default App;
