const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err,salt) =>{
    bcrypt.hash(password, salt, (err,hash)=>{
        console.log(hash);
    })
});

var hashedPassword = '$2a$10$kvnFVWce8npxXU5/x6aOn.pxYqpwhddzwXq83BfJW.5AE6bVSgpVm';

bcrypt.compare(password, hashedPassword, (err,res)=>{
    console.log(res);
})



// var data = {
//     id : 20
// }


// var token = jwt.sign(data, 'salt');
// console.log(token);

// // jwt.sign(data, 'salt' , function(err, token) {
// //     // var haha = token;
// // });

// // var decodedResult = jwt.verify(token, 'salt', (err, decoded)=>{
// //     if(err) {
// //          return console.log('You motherfucker change your ID!!');
// //     }
// //     console.log('Decoded : ', decoded);
// // });

// var decodedResult = jwt.verify(token, 'salt');
// console.log('Decoded : ', decodedResult);


// var message = "I am user number 3";

// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);

// var data1 = {
//     id : 4
// };

// // token given to user after login/save to DB
// var tokenGiventoUser = {
//     data : data1,
//     hash : SHA256(JSON.stringify(data1) + 'saltfordata1').toString()
// }

// //token is hash again to authenticate
// var resultHash = SHA256(JSON.stringify(tokenGiventoUser.data) + 'saltfordata1').toString()

// if(resultHash === tokenGiventoUser.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!!');
// }