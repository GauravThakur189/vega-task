const validator = require('validator');

const validateSignupData = (data) => {
    const { username, emailId, password } = data;

    if (!username || !emailId || !password) {
        throw new Error('All fields are required');
    }

    if (!validator.isAlpha(username) ) {
        throw new Error('name must contain only letters');
    }

    if (!validator.isEmail(emailId)) {
        throw new Error('Email is invalid');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols');
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
        throw new Error('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols')
    }
}

module.exports = {
    validateSignupData,
    validateSigninData
}