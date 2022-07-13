// imports
import mongoose from 'mongoose';

// task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: { // true for done and false for undone
        type: Boolean,
        required: true,
        default: false
    },
    list: { // parent list of task
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TaskList'
    }
});

// export task model
export default mongoose.model('Task', taskSchema, 'Task');