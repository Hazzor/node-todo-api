// const MongoClient = require('mongodb').MongoClient;

// object destructuring es6
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

//no need to precreate db
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
        // return to prevent below code from execute
    }

    console.log('Connected to MongoDB server');

    // db.collection('test2').insertOne({

    //     text : 'Something',
    //     completed : false

    // }, (err,result)=> {

    //     if (err) {
    //         return console.log('Unable to insert Todo');
    //     }

    //     console.log(JSON.stringify(result.ops , undefined , 2));
    // });

    db.collection('Users').insertOne({
        
        name : 'Heste',
        age : 20,
        location : 'Belaga'
    }, (err,result) => {
        if(err) {
            return console.log('Unable to connect to Mongodb server');
        }
            console.log(result.ops[0]._id.getTimestamp());

    })

    db.close();
});