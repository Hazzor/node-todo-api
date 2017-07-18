
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
    
    db.collection('todos').deleteOne({_id : new ObjectID('596d90726490c723d0d46e8c')}).then((result)=> {
        console.log(result);
    });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // })


    // db.close();
});