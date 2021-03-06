const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true, //trim empty string
        unique : true,
        lowercase : true,
        validate : {
            validator : validator.isEmail,
            message : '(VALUE) is not valid email'

        } 
    },
    password : {
        type : String,
        minlength : 6,
        required : true
    },
    tokens : [{
        access : {
            type : String,
            required: true
        },
        token:{
            type : String,
            required: true
        }
    }]
});
// method : for document instance where i want to modify that current document (save, update, remove)
// statics : for model where i want to perform query to a collection (find, remove)

//overwrite existing fx, method is instance method
UserSchema.methods.toJSON = function (){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//this fx return a promise2
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access : access} , process.env.JWT_SECRET);

    user.tokens.push({access,token});

// put return so that this fx return a promise
     return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this; //refer to model
    return User.findOne({email}).then((user) =>{
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password, user.password , (err,res)=>{
                if(res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        });
    })
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    // delete object in tokens if token match the value we provide
    return user.update({
        $pull : {
            tokens : {
                token : token
            }
        }
    });
}


// static is model method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        //must return promise for both happy and sad case
        return Promise.reject();

        // return new Promise ((resolve,reject)=>{
        //     reject();
        // });

    }

    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
};

// mongoose middleware, run before save
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) { //only change password is its modified
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(user.password , salt , (err,hash)=>{
                user.password = hash;
                next(); //after next is save doc
            })
        })
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User : User
}