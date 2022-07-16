// imports 
import express from 'express';
import Task from '../models/task.js';
import { authMiddleware, checkTaskListMiddleware, checkTaskMiddleware }
    from '../middleware/middleware.js';

// express router
const taskRouter = express.Router();

// add task
taskRouter.post('/api/tasks/:listId', authMiddleware, checkTaskListMiddleware, async (req, res) => {

    try {

        const task = new Task({
            ...req.body,
            list: req.params.listId,
            owner: req.user._id
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
taskRouter.get('/api/tasks/:listId', authMiddleware, checkTaskListMiddleware, async (req, res) => {

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

// change task status
taskRouter.patch('/api/tasks/status/:taskId', authMiddleware, checkTaskMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => ['status'].includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invalid updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.taskId, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.status = req.body.status
        await task.save();
        res.status(200).send({
            message: 'Task status change succesfully',
            task: {
                _id: task._id,
                title: task.title,
                status: task.status
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

// remove a task 
taskRouter.delete('/api/tasks/task/:taskId', authMiddleware, checkTaskMiddleware, async (req, res) => {

    try {

        // delete the task and return it
        const task =
            await Task.findOne({ _id: req.params.taskId, owner: req.user._id });

        const deletedTask = await task.remove();
        if (!deletedTask) return res.status(404).send({ message: 'Task not found' });
        res.status(200).send({
            message: 'Task deleted succesfully',
            deletedTask: deletedTask
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }

});

// edit task

export default taskRouter;

