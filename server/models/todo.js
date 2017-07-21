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
    },
    _creator : {
        required:true,
        type : mongoose.Schema.Types.ObjectId
    }
});

module.exports = {
    Todo : Todo
}