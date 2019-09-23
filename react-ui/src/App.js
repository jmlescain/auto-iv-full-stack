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
  const [patientsFromServer, setPatientsFromServer] = useState({patients: [], isFetching: false});
  useEffect(() => {
    setPatientsFromServer({patients: patientsFromServer.patients, isFetching: true});
    axios.get('/api/patient')
        .then(response => {
          setPatientsFromServer({patients: response.data, isFetching: false});
        })
  }, []);

  const [iv, setIv] = useState([]);
  socket.on('values-basic', data => {
    setIv(data);
  });

  const [patients, setPatients] = useState([]);
  useEffect(() => {
    let patients = patientsFromServer.patients;
    let ivs = iv;
    if (ivs.length !== 0) {
      patients.forEach((eachPatient, eachPatientIndex) => {
        ivs.forEach((eachIv, eachIvIndex) => {
          if (eachPatient._id === eachIv._id) {
            patients[eachPatientIndex].iv = ivs[eachIvIndex];
            setPatients(patients);
          }
        })
      })
    } else {
      let i;
      for (i = 0; i < patients.length; i++) {
        patients[i].iv = {};
      }
      setPatients(patients);
    }
  }, [patientsFromServer.patients, iv]);

  return (
      <div className='container'>
        <div className='patient-list'>
          <PatientList patients={patients} isFetching={patientsFromServer.isFetching}/>
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
