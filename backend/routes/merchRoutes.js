import express from 'express';
import Merch from '../models/merchModel.js';

//Creates a route to merch router
const merchRouter = express.Router();

//gets the seed router api uses an async function returning all products

merchRouter.get('/', async (req, res) => {
  //Finds the Merch then sends it to the frontend
  const merch = await Merch.find();
  res.send(merch);
});

merchRouter.get('/slug/:slug', async (req, res) => {
  //This finds the selected item
  const merch = await Merch.findOne({ slug: req.params.slug });
  if (merch) {
    res.send(merch);
    //if it fails to find it, it sends this error
  } else {
    res.status(404).send({ message: 'Merch Not Found' });
  }
});

merchRouter.get('/:id', async (req, res) => {
  //finds the selected item by id
  const merch = await Merch.findById(req.params.id);
  if (merch) {
    res.send(merch);
    //if not founf it displays this error
  } else {
    res.status(404).send({ message: 'Merch Not Found' });
  }
});

export default merchRouter;
