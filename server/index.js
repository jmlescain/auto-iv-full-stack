const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//const bcrypt = require('bcrypt');

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
  if (!isDev) {
    const redis = require('socket.io-redis');
    io.adapter(redis(process.env.REDIS_URL));
  }
  const client = io.of('/client-web-app');


  //DATABASE INITIALIZATION
  let database;
  database = require('./database');
  const PatientDataSchema = require('./models/PatientDataSchema');
  //const UserDataSchema = require('./models/UserDataSchema');

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api/patient', (req, res) => {
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

  app.get('/api/patient/:id', (req, res) => {
    let id = req.params.id;
    PatientDataSchema.findOne({_id: id},
        'lastName firstName middleName',
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

  app.get('/api/patient/:id/full', (req, res) => {
    let id = req.params.id;
    PatientDataSchema.findOne({_id: id},
        'lastName firstName middleName age weight height gender comments',
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

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/api/edit', ((req, res) => {
    let {id} = req.body;
    PatientDataSchema.findByIdAndUpdate(id, req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(`There was an error! ${err}`);
      } else if (result) {
        res.status(200).send();
        console.log(`Data for ${id} was edited.`);
        sendValues();
      }
    })
  }));



  // Socket.io things
  io.on('connect', (socket) => {
    let mac;
    let currentDripRate = 0;

    socket.on('identify', (msg) => {
      //console.log(msg);
      mac = msg.mac;

      //check if esp8266 already connected before or is in an active session
      //if patientData is returned from find, session will resume
      //else new patient data is created (assuming there is a new patient)
      async function findMac(){
        try {
          const docs = await PatientDataSchema.find({mac: msg.mac});
          if (docs.length) {
            try {
              const res = await PatientDataSchema.updateOne({mac: mac}, {isConnected: true});
              if (res) console.log('a device connected', mac);
              sendValues()
            } catch(err) {
              console.log('There was an error setting device to connected: ', err);
            }
          } else {
            let patient = new PatientDataSchema({
              mac: msg.mac,
              ip: msg.ip,
              firstConnectDate: Date.now(),
              isConnected: true
            });
            try {
              const res = await patient.save();
              console.log(res);
              sendValues()
            } catch(err) {
              console.log('There was an error writing new device record: ', err)
            }
          }
        } catch(err) {
          console.log('There was an error looking for MAC: ', err)
        }
      }

      findMac();
    });

    socket.on('values', (values) => {
      let {pulse, weight} = values;

      if (pulse > 100000) {
        let dripRatePerSecond = 1000000.00 / pulse;
        currentDripRate = dripRatePerSecond * 60;
        currentDripRate = Math.trunc(currentDripRate);
      } else if (pulse === 0) {
        currentDripRate = 0;
      }

      // A NOTE: FROM HERE ON weight ACTUALLY REFERS TO VOLUME
      // A weight OF -1 MEANS NO IV PACK IS ATTACHED
      if (weight <= 30) {
        weight = -1
      } else {
        weight = (weight - 42 );
        //weight = (weight - 42 )* 0.946969697;
        if (weight > 500) weight = 500;
        weight = Math.trunc(weight);
      }

      if (mac) {
        PatientDataSchema.findOne({mac: mac}, (error, patient) => {
          if (error) console.log(error);
          async function updateDevice() {
            try {
              patient.currentDripRate = currentDripRate;
              patient.currentWeight = weight;
              patient.valueTimeHistory.push(Date.now());
              patient.dripValueHistory.push(currentDripRate);
              patient.weightValueHistory.push(weight);
              const res = await patient.save();
              console.log(`Updated ${res.mac} with Current Drip Rate: ${res.currentDripRate} & Current Weight: ${res.currentWeight}`);
              sendValues();
            } catch(err) {
              console.log('There was an error writing drip and weight data: ', err);
            }
          }
          updateDevice();
        });
      }
    });

    socket.on('disconnect', () => {
      if (mac) {
        async function disconnectMac() {
          try {
            const res = await PatientDataSchema.updateOne({mac: mac}, {isConnected: false});
            if (res) console.log('a device disconnected', mac);
            sendValues();
          } catch(err) {
            console.log('There was an error setting device to disconnected: ',err)
          }
        }

        disconnectMac();

        /*PatientDataSchema.updateOne({mac: mac}, {isConnected: false}, (err, raw) => {
          if (err) console.log(err);
          if (raw) {
            console.log('A device has disconnected.');
            sendValues();
          }
        })*/
      }
    });
  });

  //SOCKET.IO FOR WEB APP CLIENTS
  function sendValues(id) {
    if (id === undefined) {
      async function sendDrips(){
        try {
          const docs = await PatientDataSchema.find({}, '_id targetDripRate currentDripRate currentWeight dripFactor isConnected');
          if (docs) {
            io.of('/client-web-app').emit('values-basic', docs);
            //console.log(`Emitted data for ${docs._id} with ${docs.currentDripRate} and ${docs.currentWeight}`)
          }
        } catch(err) {
          console.log('There was an error sending values...', err)
        }
      }

      sendDrips();
      /*PatientDataSchema.find({}, '_id targetDripRate currentDripRate currentWeight isConnected',
          (err, docs) => {
            if (err) console.log(err);
            if (docs) {
              io.of('client-web-app').emit('values-basic', docs);
            }
      })*/
    }
  }

  client.on('connection', (socket) => {
    console.log('device is a web app client');

    sendValues();

  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  server.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
  });
}
