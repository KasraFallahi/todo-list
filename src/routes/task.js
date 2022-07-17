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

        // create new task
        const task = new Task({
            ...req.body,
            list: req.params.listId,
            owner: req.user._id
        });

        // TODO convert this code to utility function
        // arrange task position
        // get all of the tasks in the same list
        const taskList = await Task.find({ list: task.list, owner: task.owner });

        // sort task list based on positions
        taskList.sort((a, b) => a.position - b.position);

        // check if user has sent the position or not
        if (!task.position || task.position > taskList.length + 1) {
            task.position = taskList.length + 1;
        } else {
            for (let i = 0; i < taskList.length; i++) {
                // if input position exists in the list 
                // shift all the next items in the list
                if (taskList[i].position === task.position) {
                    for (let j = i; j < taskList.length; j++) {
                        taskList[j].position++;
                        await taskList[j].save();
                    }
                    break;
                }
            }
        }

        // save task
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
        taskList.tasks.sort((a, b) => a.position - b.position);
        res.status(200).send(taskList.tasks.map(task => {
            return {
                _id: task._id,
                title: task.title,
                status: task.status,
                position: task.position
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
                status: task.status,
                position: task.position
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

        // TODO convert this code to utility function
        // arrange task position
        // get all of the tasks in the same list
        const taskList = await Task.find({ list: task.list, owner: task.owner });

        // sort task list based on positions
        taskList.sort((a, b) => a.position - b.position);

        // check if task is the last item in list
        if (task.position !== taskList.length) {
            for (let i = task.position - 1; i < taskList.length; i++) {
                // unshift all the next items in the list
                taskList[i].position--;
                await taskList[i].save();
            }
        }

        res.status(200).send({
            message: 'Task deleted succesfully',
            deletedTask: deletedTask
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }

});

// edit task title and position
taskRouter.patch('/api/tasks/task/:taskId', authMiddleware, checkTaskMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => ['title', 'position'].includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invalid updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.taskId, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        // edit title
        if (req.body.title) task.title = req.body.title;

        // TODO convert this code to utility function
        // arrange task position

        // get all of the tasks in the same list
        const taskList = await Task.find({ list: task.list, owner: task.owner });

        // sort task list based on positions
        taskList.sort((a, b) => a.position - b.position);

        // check if user has sent the position or not
        if (req.body.position || req.body.position !== task.position) {
            if (req.body.position > task.position) { // unshift tasks before
                if (req.body.position >= taskList.length) {
                    for (let i = task.position; i < taskList.length; i++) {
                        taskList[i].position--;
                        await taskList[i].save();
                    }
                    task.position = taskList.length;
                } else {
                    for (let i = task.position; i < req.body.position; i++) {
                        taskList[i].position--;
                        await taskList[i].save();
                    }

                    task.position = req.body.position;
                }
            } else { // shift tasks after
                for (let i = req.body.position - 1; i < task.position; i++) {
                    taskList[i].position++;
                    await taskList[i].save();
                }
                task.position = req.body.position;
            }
        }

        await task.save();
        res.status(200).send({
            message: 'Task edited change succesfully',
            task: {
                _id: task._id,
                title: task.title,
                status: task.status,
                position: task.position
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

export default taskRouter;

