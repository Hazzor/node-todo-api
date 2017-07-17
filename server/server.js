var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// middleware parser type
app.use(bodyParser.text());
app.use(bodyParser.json());

// receive post from client and create path todos
app.post('/todos', (req,res)=> {
    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send('Unable to save todo');
    });
    console.log(req.body);
});

app.listen(3000, ()=> {
    console.log('Started on port 3000');
});

// var date = new Date();
// var day = date.getDate();
// var month = date.getMonth();
// var year = date.getFullYear();
// var fulldate = `${day}/${month + 1}/${year}`;

// var Todo1 = new Todo({
//     text : '   Cook lunch   ',
//     completed : false,
//     completeAt : fulldate
// });

// // save to mongodb
// Todo1.save().then((doc)=>{
//     console.log('Saved todo', doc);
// }, (e)=>{
//     console.log('Unable to save todo')
// });




// var user = new User({
//     email : 'hes'
// });

// user.save().then((doc)=>{
//     console.log('User saved', doc);
// }, (e)=>{
//     console.log('User cant be saved');

// });


