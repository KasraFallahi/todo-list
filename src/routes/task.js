// imports 
import express from 'express';
import Task from '../models/task.js';
import TaskList from '../models/taskList.js';
import authMiddleware from '../middleware/middleware.js';

// express router
const taskRouter = express.Router();

// add task
taskRouter.post('/api/tasks/:parentId', authMiddleware, async (req, res) => {

    try {

        // get tasklist to check if exists and belongs to that user
        const taskList = await TaskList.findOne({ _id: req.params.parentId });
        if (!taskList) throw new Error('Task parent does not exist');

        if (taskList.owner._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to modify this list');
        }

        const task = new Task({
            ...req.body,
            list: req.params.parentId
        });
        await task.save();
        res.status(200).send({
            message: 'task saved succesfully'
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).send({ message: error.message });
    }

});

// get tasks of a list
taskRouter.get('/api/tasks/:parentId', authMiddleware, async (req, res) => {

    try {

        // get tasklist to check if exists and belongs to that user
        const taskList = await TaskList.findOne({ _id: req.params.parentId });
        if (!taskList) throw new Error('Task list does not exist');

        if (taskList.owner._id.toString() !== req.user._id.toString()) {
            throw new Error('You are not allowed to get this list');
        }

        // use the virtual data(tasks) of task list
        await taskList.populate('tasks');
        res.status(200).send(taskList.tasks.map(task => {
            return {
                _id: task._id,
                title: task.title,
                status: task.status
            }
        }));

    } catch (error) {
        console.error(error.message);
        res.status(400).send({ message: error.message });
    }

});

// remove task
// edit task
// change task status

export default taskRouter;

