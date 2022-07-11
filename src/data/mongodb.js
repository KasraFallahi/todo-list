// imports
import mongoose from 'mongoose';

const dbName = 'todo-list-db';

mongoose.connect(process.env.MOGODB_URL + '/' + dbName, {
    useNewUrlParser: true
});