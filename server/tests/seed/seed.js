const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{

    _id : userOneId,
    email : 'hester@gmail.com',
    password : 'hesterliong',
    tokens : [{
        access : 'auth',
        token : jwt.sign({_id:userOneId, access:'auth'}, '123abc')
    }]
}, {
    
    _id : userTwoId,
    email : 'boyyy@gmail.com',
    password : 'hazzore',
    tokens : [{
    access : 'auth',
    token : jwt.sign({_id:userTwoId, access:'auth'}, '123abc')
}]

}];

const todos = [{
    _id : new ObjectID(),
    text : 'First test todo',
    _creator : userOneId
}, {
    _id : new ObjectID(),
    text : 'Second test todo',
    completed : true,
    completeAt : 3333,
    _creator : userTwoId
}];

const populateTodos = (done)=>{

    Todo.remove({}).then(()=>{
         return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

// promise all execute if all promise in array is resolve
        return Promise.all([userOne, userTwo])
    }).then(()=> done())

}

module.exports = {todos, users, populateTodos, populateUsers};
