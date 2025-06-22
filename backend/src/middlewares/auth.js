const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        const decoded = await jwt.verify(token, 'secret');  key
        const user = await User.findById(decoded.id); 

        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user; 
        next(); 
    } catch (error) {
        res.status(401).send('Unauthorized: Invalid token');
    }
};

module.exports = userAuth;