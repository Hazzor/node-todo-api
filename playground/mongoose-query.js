const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var uid = '596c1c0938773624900b96e9';
var id = '96cbb6a1ce33a1c18903c3b';

if(!ObjectID.isValid(uid)) {
    console.log('ID not valid');
}

//mongoose no need to instantiate objectID
// Todo.find({
//     _id : id
// }).then((todos)=>{

//     if(todos.length === 0) {
//         return console.log('Todo not found');
//     }
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id : id
// }).then((todo)=>{

//     if(!todo) {
//         return console.log('Todo not found');
//     }
//     console.log('Tod by findOne', todo);
// });

// Todo.findById(id).then((todo)=>{

//     if(!todo) {
//         return console.log('Todo not found');
//     }
//     console.log('Todo by ID', todo);
// }).catch((e)=>{
//     console.log(e.name);
// });

User.findById(uid).then((user)=>{

    if(!user) {
        return console.log('User not found');
    }
    console.log('User by ID : ', JSON.stringify(user, undefined, 3));
}).catch((e)=>{
    console.log(e.name);
});