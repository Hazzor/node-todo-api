var env = process.env.NODE_ENV || 'development'; //in heroku only
// console.log('env :', env);

//will not run in heroku, but wil run in local machine
if(env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });
}

// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// };