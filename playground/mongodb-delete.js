
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=> {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
        // return to prevent below code from execute
    }

    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text : 'play basket'}).then((result)=> {
    //     console.log(result);
    // })

    //deleteOne
    
    db.collection('Users').deleteOne({_id : new ObjectID('596abb990cde881f8c80027d')}).then((result)=> {
        console.log(result);
    });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // })


    // db.close();
});