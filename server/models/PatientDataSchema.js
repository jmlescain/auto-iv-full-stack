let mongoose = require('mongoose');
let validator = require('validator');

const Schema = mongoose.Schema;

const PatientDataSchema = new Schema(
    {
      //ESP8266 DEVICE DETAILS
      mac: {
        type: String,
        unique: true,
        validate: (value) => {
          return validator.isMACAddress(value)
        }
      },
      ip: {
        type: String,
        unique: true,
        validate: (value) => {
          return validator.isIP(value)
        }
      },
      firstConnectDate: Date,
      isConnected: Boolean,

      //PATIENT DETAILS
      lastName: String,
      middleName: String,
      firstName: String,
      age: Number,
      weight: Number,
      height: Number,
      gender: String,
      comment: String,

      // TIME DETAILS
      valueTimeHistory: [Date],

      //DRIP DETAILS
      currentDripRate: Number,
      dripValueHistory: [Number],
      targetDripRate: Number,

      //WEIGHT DETAILS
      currentWeight: Number,
      weightValueHistory: [Number],
      estimatedWeightEmpty: Date
    }
);

let PatientData = mongoose.model("PatientData", PatientDataSchema);
module.exports = PatientData;
