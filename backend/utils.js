import jwt from 'jsonwebtoken';

//generate token accepts user info
export const generateToken = (user) => {
  //calls sign function
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    //The JWT_SECRET is used to encypt the data
    process.env.JWT_SECRET,
    {
      //expiration for loggin
      expiresIn: '14d',
    }
  );
};

//defining isAuth
export const isAuth = (req, res, next) => {
  //request authorization from headers
  const authorization = req.headers.authorization;
  if (authorization) {
    //if there is authroization gets token from authorization by using slice only getting the token part
    const token = authorization.slice(8, authorization.length);

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      //The call back function
      if (err) {
        //If invalid return this error
        res.status(401).send({ message: 'Invalid Token ' });
      } else {
        //uses the decrypted user
        req.user = decode;
        next();
      }
    });
    //if there is no authrization it sends this message to user
  } else {
    res.status(401).send({ message: 'Missing Token ' });
  }
};
