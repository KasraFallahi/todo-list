// imports 
import express from 'express';
import TaskList from '../models/taskList.js';
import authMiddleware from '../middleware/middleware.js';

// express router
const taskListRouter = express.Router();

// create task list
taskListRouter.post('/api/tasks/add', authMiddleware, async (req, res) => {

    try {

        const taskList = new TaskList(req.body);
        await taskList.save();
        res.status(200).send({
            message: 'task list saved succesfully',
            id: taskList._id
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({ message: error.message });
    }

});

// remove task list
// edit task list

export default taskListRouter;

