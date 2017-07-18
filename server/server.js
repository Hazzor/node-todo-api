require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;
// middleware parser type
// app.use(bodyParser.text());
app.use(bodyParser.json());

// receive post from client and create path todos
app.post('/todos', (req,res)=> {
    // instantiate Todo model prototype
    var todo = new Todo({
        text : req.body.text1
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send('Unable to save todo');
    });
    console.log(req.body);
});

app.get('/todos', (req, res)=> {
    Todo.find().then((todos)=>{

        res.send({
            todosArray : todos,
            code : 200
        });
    }, (e)=>{

        res.status(400).send('Unable to save todo');
    });
});

app.get('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(400).send('Todo ID invalid');
    }
    else {

        Todo.findById(id).then((todo)=>{
            if(!todo){
                
                return res.status(404).send('Todo not found');
            }
            res.status(200).send({todoByID:todo});
        }, (e)=>{
            res.status(400).send('Bad Request', e.name);
        });
    }
});

app.delete('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(400).send('Todo ID invalid');
    }

    else {

        Todo.findByIdAndRemove(id).then((todo)=>{
            if(!todo){
                
                return res.status(404).send('Todo not found');
            }
            res.status(200).send({todoDeleted:todo});
        }, (e)=>{
            res.status(400).send('Bad Request', e.name);
        });
    }
});

app.patch('/todos/:id', (req,res)=>{
    var id = req.params.id;
    //choose only ones that are provided and move to body
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(400).send('Todo ID invalid');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completeAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completeAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo)=>{
        if(!todo) {
            return res.status(404).send('Update failed');
        }

        res.status(200).send({TodoUpdated : todo});

    }).catch((e)=>{
        res.status(400).send('Unable to update');
    })
})

app.listen(port, ()=> {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app : app
}

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


