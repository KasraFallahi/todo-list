// imports
import mongoose from 'mongoose';
import Task from './task.js';

// task list schema
const taskListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

// remove tasks before removing the whole list
taskListSchema.pre('remove', async function (next) {
    const taskList = this;
    await Task.deleteMany({ list: taskList._id });
    next();
})

// virtual task model
taskListSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'list'
});

// export task list model
export default mongoose.model('TaskList', taskListSchema, 'TaskList');