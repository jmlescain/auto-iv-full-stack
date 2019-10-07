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

  /*const [emptyAlert] = useState(new Audio(emptyAlertAudio));

  useEffect(() => {
    let patients = patientsFromServer.patients;
    let okayNumber = 0;
    patients.forEach((patient) => {
      let {currentDripRate, currentWeight, dripFactor} = patient;
      let volumePerMinute = currentDripRate / dripFactor;
      let minutesRemaining = currentWeight / volumePerMinute;
      minutesRemaining = Math.trunc(minutesRemaining);
      if (minutesRemaining < 6) {
        setShouldAlertPlay(true);
      } else {
        okayNumber++;
        if (okayNumber === patients.length) setShouldAlertPlay(false);
      }
    })
  }, [patientsFromServer.patients]);*/

  /*const [shouldAlertPlay, setShouldAlertPlay] = useState(false);
  useEffect(()=>{
    if (shouldAlertPlay) {
      emptyAlert.loop = true;
      emptyAlert.play()
    } else {
      emptyAlert.pause();
    }
  }, [shouldAlertPlay]);*/

/*  const [id, setId] = useState('');
  function getPatientInformation(id) {
    setId(id)
  }*/

  /*const [dripOfCurrentId, setDripOfCurrentId] = useState({});
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
  }, [patientsFromServer.patients, id]);*/

  /*const [idChangedCard, setIdChangedCard] = useState('');
  function refreshCard(idChangedCard){
    setIdChangedCard(idChangedCard);
  }*/


  return (
      <div className='container'>
          <PatientList patients={patientsFromServer.patients}
                       isFetching={patientsFromServer.isFetching}
          />
      </div>
  );

}

export default App;
