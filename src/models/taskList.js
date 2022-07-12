// imports
import mongoose from 'mongoose';

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
});

// virtual task model
taskListSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'list'
});

// export task list model
export default mongoose.model('TaskList', taskListSchema);