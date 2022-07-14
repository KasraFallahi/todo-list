// imports 
import express from 'express';
import Task from '../models/task.js';
import TaskList from '../models/taskList.js';
import { authMiddleware, checkTaskMiddleware } from '../middleware/middleware.js';

// express router
const taskRouter = express.Router();

// add task
taskRouter.post('/api/tasks/:listId', authMiddleware, checkTaskMiddleware, async (req, res) => {

    try {

        const task = new Task({
            ...req.body,
            list: req.params.listId
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
taskRouter.get('/api/tasks/:listId', authMiddleware, checkTaskMiddleware, async (req, res) => {

    try {

        const taskList = req.taskList;

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
        console.error(error);
        res.status(400).send({ message: error.message });
    }

});

// remove task
// edit task
// change task status

export default taskRouter;

