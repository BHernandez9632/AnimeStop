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
    //error message if password or email is wrong
    res.status(401).send({ message: 'Invalid Entry' });
  })
);
