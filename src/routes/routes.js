// imports 
import express from 'express';
import Task from '../models/task.js';

// express router
const router = express.Router();

// --task routes--

// add task
router.post('/tasks/add', async (req, res) => {

    try {

        const task = new Task(req.body);
        await task.save();
        res.status(200).send({
            message: 'task saved succesfully'
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }

});

export default router;

