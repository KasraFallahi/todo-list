// imports
import express from 'express';
import './data/mongodb.js';
import router from './routes/routes.js';

// init express
const app = express();
app.use(express.json());
const port = process.env.PORT;

// assign router
app.use(router);

// run server
app.listen(port, () => console.log('server is running on localhost port ' + port));