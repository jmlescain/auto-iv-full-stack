import React, { useState, useEffect } from 'react';

import PatientList from "./components/PatientList";

import './App.css';
import Details from "./components/Details";
import Notification from "./components/Notification";
import NotifList from "./components/NotifList";

let isDev = process.env.NODE_ENV !== 'production';
let ioOptions = {transports: ['websocket']};
if (isDev) {
  ioOptions = {}
}

const io = require('socket.io-client');
const socket = io('/client-web-app', ioOptions);

function App() {
  const [patientsFromServer, setPatientsFromServer] = useState({patients: [], isFetching: true});
  socket.on('values-basic', (data) => {
    setPatientsFromServer({patients: data, isFetching: false});
  });

  const [id, setId] = useState('');
  function getPatientInformation(id) {
    setId(id)
  }

  const [dripOfCurrentId, setDripOfCurrentId] = useState({});
  useEffect(() => {
    if (id) {
      let patients = patientsFromServer.patients;
      let patient = patients.find(patient => patient._id === id);
      let {currentDripRate, currentWeight, dripFactor} = patient;
      let volumePerMinute = currentDripRate / dripFactor;
      let minutesRemaining = currentWeight / volumePerMinute;
      minutesRemaining = Math.trunc(minutesRemaining);
      patient.minutesRemaining = minutesRemaining;
      setDripOfCurrentId(patient);
    }
  }, [patientsFromServer.patients, id]);

  const [idChangedCard, setIdChangedCard] = useState('');
  function refreshCard(idChangedCard){
    setIdChangedCard(idChangedCard);
  }

  const [notifs, setNotifs] = useState([]);

  return (
      <div className='container'>
        <div className='patient-list'>
          <PatientList patients={patientsFromServer.patients}
                       isFetching={patientsFromServer.isFetching}
                       getPatientInformation={getPatientInformation}
                       idChangedCard={idChangedCard}
          />
        </div>
        <div className='details'>
          <Details id={id}
                   dripData={dripOfCurrentId}
                   getPatientInformation={getPatientInformation}
                   refreshCard={refreshCard}
          />
        </div>
        <div className='notifications'>
          <NotifList notifs={notifs}/>
        </div>
      </div>
  );

}

export default App;
