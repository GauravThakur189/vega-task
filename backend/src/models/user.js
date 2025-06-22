const mongoose = require('mongoose');
const validator = require('validator');

const username = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        maxLength: 40,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error('Name must contain only letters')
            }
        }
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is weak')
            }
        }
    },
    // photoUrl:{
    //     type:String,
    //     validate(value){
    //         if(!validator.isURL(value)){
    //             throw new Error('Photo URL is invalid')
    //         }
    //     }
    // },
    photoUrl: {
  type: String,
  validate(value) {
    const isFullURL = validator.isURL(value, { require_protocol: true });
    const isRelativePath = value.startsWith('/uploads/');
    if (!isFullURL && !isRelativePath) {
      throw new Error('Photo URL must be a valid URL or relative path');
    }
  }
},
    
},{timestamps:true})

const User = mongoose.model('User',username)
module.exports = User