// imports
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';
import TaskList from '../models/taskList.js';

// middleware function to check athentication
const authMiddleware = async (req, res, next) => {
    try {

        // get the jwt from request header
        const token = req.header('Authorization').replace('Bearer ', '');

        // get user id from jwt
        const userId = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // get user from database and pass user data to request body
        req.user = await User.findOne({ _id: userId, 'tokens.token': token });
        next();

    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized' });
    }
}

// get tasklist to check if exists and belongs to that user
const checkTaskMiddleware = async (req, res, next) => {
    try {
        // check if given id is valid
        if (!req.params.listId.match(/^[0-9a-fA-F]{24}$/)) throw new Error('Task list does not exist');

        const taskList = await TaskList.findOne({ _id: req.params.listId });
        if (!taskList) throw new Error('Task list does not exist');

        if (taskList.owner._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to get this list');
        }

        req.taskList = taskList;

        next();

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export { authMiddleware, checkTaskMiddleware };