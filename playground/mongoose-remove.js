const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//doesnt get the doc back after remove
// Todo.remove({_id : new ObjectID('596d7037ba1173349898fc8d')}).then((result)=>{
//     console.log(result);
// });

// return result after remove

// Todo.findOneAndRemove

// Todo.findByIdAndRemove('596d89812f1e522c4cefe48e').then((todo)=>{

//     console.log(todo);

// });

Todo.findOneAndRemove({_id : '596d8cde2f1e522c4cefe48f' }).then((todo)=>{
   
    console.log(todo);

});
