// imports 
import express from 'express';
import User from '../models/user.js';

// express router
const userRouter = express.Router();

// register user
userRouter.post('/api/users/register', async (req, res) => {

    try {

        const user = new User(req.body);
        const jwt = await user.authUser();
        await user.save();
        res.status(200).send({
            message: 'User registered succesfully',
            token: jwt
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }

});

// login user 
userRouter.get('/api/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.username, req.body.password);

        // generate new jwt for every new login
        const token = await user.authUser();
        res.status(200).send({
            user: {
                id: user._id,
                username: user.username
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }
});

export default userRouter;