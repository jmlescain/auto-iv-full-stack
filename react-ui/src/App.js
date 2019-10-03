import React, { useState, useEffect } from 'react';
import ReactNotification, { store } from 'react-notifications-component';

import PatientList from "./components/PatientList";

import './App.css';
import 'react-notifications-component/dist/theme.css';

import emptyAlertAudio from './assets/empty_alert.mp3';

import Details from "./components/Details";
//import Notification from "./components/Notification";
//import NotifList from "./components/NotifList";

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

  const [emptyAlert] = useState(new Audio(emptyAlertAudio));

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
        store.addNotification({
          title: "IV Pack Almost Empty",
          message: `An IV Pack is almost empty in less than ${minutesRemaining} minutes.`,
          type: "warning",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 0
          }
        });
      } else {
        okayNumber++;
        if (okayNumber === patients.length) setShouldAlertPlay(false);
      }
    })
  }, [patientsFromServer.patients]);

  const [shouldAlertPlay, setShouldAlertPlay] = useState(false);
  useEffect(()=>{
    if (shouldAlertPlay) {
      emptyAlert.loop = true;
      emptyAlert.play()
    } else {
      emptyAlert.pause();
    }
  }, [shouldAlertPlay]);

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

  //const [notifs, setNotifs] = useState([1,2,3]);


  return (
      <div className='container'>
        <ReactNotification />
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
      </div>
  );

}

export default App;
