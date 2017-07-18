var mongoose = require('mongoose');

// use native promise
mongoose.Promise = global.Promise;
//persistent connection, mongoose is using callback by default
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose : mongoose
}

// process.env.NODE_ENV = development,test,production