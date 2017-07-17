var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text : {
        type : String,
        required : true,
        minlength : 1,
        trim : true //trim empty string


    },
    completed : {
        type : Boolean,
        default : false
    },
    completeAt: {
        type : String,
        default : null
    }
});

module.exports = {
    Todo : Todo
}