
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
        // return to prevent below code from execute
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id : new ObjectID('596b5e0eba3db8437d08fabc')
    // }, {
    //     $set : {
    //         completed : false
    //     }
    // }, {
    //     returnOriginal : false
    // }).then((result)=> {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('59685dd50af2c642d098d7dd')
    }, {
        $set : {
            name : 'Ronaldo'
        },
        $inc : {
            age : 5
        }
    }, {
        returnOriginal : false
    }).then((result)=> {
        console.log(result);
    });

    // db.close();
});