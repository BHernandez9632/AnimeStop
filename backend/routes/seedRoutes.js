import express from 'express';
import Merch from '../models/merchModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

//Creates a route to seed router
const seedRouter = express.Router();

//gets the seed router api uses an async function
seedRouter.get('/', async (req, res) => {
  //This removes all previous data in merch
  await Merch.deleteMany({});
  //This creates new merch data
  const createdMerchs = await Merch.insertMany(data.merchs);
  //This removes all previous data in user
  await User.deleteMany({});
  //This creates new users
  const createdUsers = await User.insertMany(data.users);
  //used to send the data of user and merch to the frontend
  res.send({ createdMerchs, createdUsers });
});

export default seedRouter;
