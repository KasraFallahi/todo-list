// imports
import express from 'express';
import morgan from 'morgan';
import './data/mongodb.js';
import taskRouter from './routes/task.js';
import taskListRouter from './routes/taskList.js';
import userRouter from './routes/user.js';

// init express
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('[:date[web]] :method :url :status - :response-time ms'));

// assign routers
app.use(taskRouter);
app.use(taskListRouter);
app.use(userRouter);

// run server
app.listen(port, () => console.log('server is running on localhost port ' + port));