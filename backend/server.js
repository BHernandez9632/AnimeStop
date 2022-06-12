import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import merchRouter from './routes/merchRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

//dotenv used to fetch variables in .env file
dotenv.config();
//Connection to the MongoDB
mongoose
  //process.env.MONGODB_URI variable carries the .env value
  .connect(process.env.MONGODB_URI)
  //This returns a promise if everything is fully functional
  .then(() => {
    console.log('connected');
  })
  //If it isn't it catches error and returns error message
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

//These lines converts data inside req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//When user enters any of the bottom api it will reach to its respective router and display it
app.use('/api/seed', seedRouter);
app.use('/api/merchs', merchRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

//Connection needed for cloud
const __dirname = path.resolve();
//serves all files from frontend build folder as a static file
app.use(express.static(path.join(__dirname, '/frontend/build')));
//Everything a user enters in domain is served by index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

//This is the error handler for express
app.use((err, req, res, next) => {
  //Displays server error with message coming from error object
  res.status(500).send({ message: err.message });
});

//defining port for the backend
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
