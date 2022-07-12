// imports
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';

// middleware function to check athentication
const authMiddleware = async (req, res, next) => {
    try {

        // get the jwt from request header
        const token = req.header('Authorization').replace('Bearer ', '');

        // get user id from jwt
        const userId = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // get user from database and pass user data to request body
        req.user = User.findOne({ _id: userId });
        next();

    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized' });
    }
}

export default authMiddleware;