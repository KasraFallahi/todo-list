// imports
import mongoose from 'mongoose';

const dbName = 'todo-list-db';

mongoose.connect(process.env.MONGODB_URL + '/' + dbName, {
    useNewUrlParser: true
});