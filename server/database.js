let mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'autoiv';

//const devUri = `mongodb://${server}/${database}`;
let uri = 'mongodb://dbujan:passwordispassword1@ds015942.mlab.com:15942/heroku_xv9rmkdz';

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
    uri = `mongodb://${server}/${database}`;
}

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(uri, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
            .then(() => {
                console.log('Database connection successful!')
            })
            .catch(err => {
                console.error(`database connection error!: ${err}`)
            })
    }
}

module.exports = new Database();

