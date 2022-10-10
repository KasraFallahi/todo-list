// imports
import mongoose from 'mongoose';

// const dbName = 'todo-list-db';
const dbName = 'test';

(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URL + '/' + dbName
            , { useNewUrlParser: true });
        console.log('connected successfuly');
    }
    catch (e) {
        console.log(e);
    }
})();