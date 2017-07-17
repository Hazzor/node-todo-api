var mongoose = require('mongoose');

// use native promise
mongoose.Promise = global.Promise;
//persistent connection, mongoose is using callback by default
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose : mongoose
}