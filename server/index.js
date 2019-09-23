const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bcrypt = require('bcrypt');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  let ioOptions = {transports: ['websocket']};
  if (isDev) {
    ioOptions = {}
  }
  const app = express();
  const server = http.createServer(app);
  const io = socketIO(server, ioOptions);


  //DATABASE INITIALIZATION
  let database;
  database = require('./database');
  const PatientDataSchema = require('./models/PatientDataSchema');
  const UserDataSchema = require('./models/UserDataSchema');

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api/patient', (req, res, next) => {
    PatientDataSchema.find({},
                '_id lastName firstName middleName',
                  {sort: {lastName: 1}} ,
                  (err, docs) => {
                              if (err) {
                                console.log(err);
                                res.status(500).send('There was an error.');
                                //next();
                              }
                              if (docs) {
                                res.type('json');
                                res.send(docs);
                              }
                          });
  });

  app.get('/api/patient/:id', (req, res, next) => {
    let id = req.params.id;
    PatientDataSchema.findOne({_id: id},
        'lastName firstName middleName targetDripRate age weight height gender comments',
        (err, docs) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send('There was an error. Check patient ID.')
                    }
                    if (docs) {
                      res.type('json');
                      res.send(docs);
                    }

        })
  });



  // Socket.io things
  io.on('connect', (socket) => {
    console.log('a device connected');
    let mac;
    let currentDripRate = 0;

    socket.on('identify', (msg) => {
      console.log(msg);
      mac = msg.mac;

      //check if esp8266 already connected before or is in an active session
      //if patientData is returned from find, session will resume
      //else new patient data is created (assuming there is a new patient)
      PatientDataSchema.find({mac: msg.mac})
          .then(patient => {
                if (patient.length) {
                  console.log(patient);
                  PatientDataSchema.updateOne({mac: mac}, {isConnected: true}, (err, raw) => {
                    if (err) console.log(err);
                  });
                  console.log('This device has already connected. Will resume session.');
                  sendValues()
                } else {
                  let patient = new PatientDataSchema({
                    mac: msg.mac,
                    ip: msg.ip,
                    firstConnectDate: Date.now(),
                    isConnected: true
                  });
                  patient.save()
                      .then(doc => {
                        console.log(doc);
                        sendValues();
                      })
                      .catch(err => {
                        console.error(err)
                      })
                }
              }
          );
    });

    socket.on('values', (values) => {
      let {pulse, weight} = values;

      if (pulse > 100000) {
        let dripRatePerSecond = 1000000.00 / pulse;
        currentDripRate = dripRatePerSecond * 60;
        currentDripRate = Math.trunc(currentDripRate);
      }

      if (mac) {
        PatientDataSchema.findOne({mac: mac}, (error, patient) => {
          if (error) console.log(error);
          patient.currentDripRate = currentDripRate;
          patient.currentWeight = weight;
          patient.valueTimeHistory.push(Date.now());
          patient.dripValueHistory.push(currentDripRate);
          patient.weightValueHistory.push(weight);
          patient.save()
              .then(() => {
                console.log(`Wrote data for ${patient._id} with Drip Rate: ${currentDripRate}, Weight: ${weight}`);
                sendValues();
              }).catch(err => {
            console.log(err)
          });
        });

      }

    });

    socket.on('disconnect', () => {
      if (mac) {
        PatientDataSchema.updateOne({mac: mac}, {isConnected: false}, (err, raw) => {
          if (err) console.log(err);
          if (raw) {
            console.log('A device has disconnected.');
            sendValues();
          }
        })
      }
    });
  });

  //SOCKET.IO FOR WEB APP CLIENTS
  const client = io.of('/client-web-app');

  function sendValues(id) {
    if (id === undefined) {
      PatientDataSchema.find({}, '_id targetDripRate currentDripRate currentWeight isConnected',
          (err, docs) => {
            if (err) console.log(err);
            if (docs) {
              io.of('client-web-app').emit('values-basic', docs);
            }
      })
    }
  }

  client.on('connection', socket => {
    console.log('device is a web app client');


  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  server.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
  });
}
