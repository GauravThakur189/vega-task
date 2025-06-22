const validator = require('validator');

const validateSignupData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (!username || !emailId || !password) {
        throw new Error('All fields are required');
    }

    if (!validator.isAlpha(username) ) {
        throw new Error('First and last names must contain only letters');
    }

    if (!validator.isEmail(emailId)) {
        throw new Error('Email is invalid');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is weak');
    }
}

const validateSigninData = (data)=>{
    const {emailId,password} = data

    if(!emailId || !password){
        throw new Error('All fields are required')
    }

    if(!validator.isEmail(emailId)){
        throw new Error('Email is invalid')
    }

    if(!validator.isStrongPassword(password)){
        throw new Error('Password is weak')
    }
}

module.exports = {
    validateSignupData,
    validateSigninData
}