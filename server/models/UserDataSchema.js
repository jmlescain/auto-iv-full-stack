let mongoose = require('mongoose');
let validator = require('validator');

const Schema = mongoose.Schema;

const UserDataSchema = new Schema ({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  hashedPassword: {
    required: true,
    type: String
  },
  token: {
    type: String
  },
  tokenExpiry: {
    type: Date
  }
});

let UserData = mongoose.model('UserData', UserDataSchema);
module.exports = UserData;