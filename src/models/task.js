// imports
import mongoose from 'mongoose';

// task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: { // true for done and false for undone
        type: Boolean,
        required: true,
        default: false
    }
});

// export task model
export default mongoose.model('Task', taskSchema);