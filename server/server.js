require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
// middleware parser type
// app.use(bodyParser.text());
app.use(bodyParser.json());

// client post todo with token
app.post('/todos', authenticate, (req,res)=> {
    // instantiate Todo model prototype
    var todo = new Todo({
        text : req.body.text,
        _creator : req.user._id
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send('Unable to save todo');
    });
    console.log(req.body);
});

// get all todos
app.get('/todos', authenticate , (req, res)=> {
    Todo.find({
        _creator : req.user._id
    }).then((todos)=>{

        res.send({
            todosArray : todos,
            code : 200
        });
    }, (e)=>{

        res.status(400).send('Unable to save todo');
    });
});

// get todo based on id
app.get('/todos/:id', authenticate , (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(400).send('Todo ID invalid');
    }
    else {

        Todo.findOne({
            _id : id,
            _creator : req.user._id
            }).then((todo)=>{
            if(!todo){
                
                return res.status(404).send('Todo not found');
            }
            res.status(200).send({todoByID:todo});
        }, (e)=>{
            res.status(400).send('Bad Request', e.name);
        });
    }
});

//delete todo based on id
app.delete('/todos/:id', authenticate , (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(400).send('Todo ID invalid');
    }

    else {

        Todo.findOneAndRemove({
            _id : id,
            _creator : req.user._id
        }).then((todo)=>{
            if(!todo){
                
                return res.status(404).send('Todo not found');
            }
            res.status(200).send({todoDeleted:todo});
        }, (e)=>{
            res.status(400).send('Bad Request', e.name);
        });
    }
});

//update todo based on id
app.patch('/todos/:id', authenticate, (req,res)=>{
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

    Todo.findOneAndUpdate({
        _id : id,
        _creator : req.user._id },
        {$set : body },
        {new : true }
    )
        .then((todo)=>{
        if(!todo) {
            return res.status(404).send('Update failed');
        }

        res.status(200).send({TodoUpdated : todo});

    }).catch((e)=>{

        res.status(400).send('Unable to update');
    });
});

//register user
app.post('/users', (req,res)=> {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.generateAuthToken()
    .then((token)=>{
        res.header('x-auth', token).send(user);
    })
    .catch((e)=>{
        if (e.code === 11000) {
            res.status(400).send({message: 'An account already exists with that email.'});
        } else {
            res.status(400).send(e);
        }
    });
});

//private route for individual user
app.get('/users/me', authenticate, (req,res)=>{
    res.status(200).send(req.user);
});

//login
app.post('/users/login' ,(req,res)=>{

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send();
        });

    }).catch((e)=>{
        res.status(400).send('Login failed : No user found');
    })

});

//logout
app.delete('/users/me/token' , authenticate , (req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send('Succesfully logout');
    }).catch((e)=>{
        res.status(400).send();
    })
});

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


