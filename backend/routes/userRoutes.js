import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, generateToken } from '../utils.js';

//Creates a route to user router
const userRouter = express.Router();

userRouter.post(
  '/signin',
  //The expressAsyncHandler allow the error in sign in to be caught in the  function
  expressAsyncHandler(async (req, res) => {
    //findOne is used on user model to find the email
    const user = await User.findOne({ email: req.body.email });
    //This verifies if user exist
    if (user) {
      //This condition checks the password in bcypt it uses compare compareSync to compare the plain text password to encypted password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          //generates the token by passing user object sends to front end
          token: generateToken(user),
        });
        return;
      }
    }
    //error message if password pr email is wrong
    res.status(401).send({ message: 'Invalid Entry' });
  })
);

userRouter.post(
  '/signup',
  //The expressAsyncHandler allow the error in sign up to be caught in the function
  expressAsyncHandler(async (req, res) => {
    //creates new user from mongoose model
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      //bcypt encrypts password
      password: bcrypt.hashSync(req.body.password),
    });
    //saves new user in the database
    const user = await newUser.save();
    //sends user data to the frontend
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  //authenticates file
  isAuth,
  //The expressAsyncHandler allow the error in sign up to be caught in the function+
  expressAsyncHandler(async (req, res) => {
    //gets the user from database
    const user = await User.findById(req.user._id);
    //checks user
    if (user) {
      //if user exists update name and email || id data empty use previous
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      //if password exists encrypt it
      if (req.body.password) {
        //encypts password with bcypt
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      //updates password
      const updatedUser = await user.save();
      //sends back the user information
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        //generates the token by passing user object sends to front end
        token: generateToken(updatedUser),
      });
      //sets status to 404 and delivers message
    } else {
      res.status(404).send({ message: 'Account Not Found' });
    }
  })
);

export default userRouter;
