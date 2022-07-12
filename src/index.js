// imports
import express from 'express';
import './data/mongodb.js';
import taskRouter from './routes/task.js';
import taskListRouter from './routes/taskList.js';
import userRouter from './routes/user.js';

// init express
const app = express();
app.use(express.json());
const port = process.env.PORT;

// assign routers
app.use(taskRouter);
app.use(taskListRouter);
app.use(userRouter);

// run server
app.listen(port, () => console.log('server is running on localhost port ' + port));