const jwt = require("jsonwebtoken");
const UserDetails = require("../model/UserModel");

const requireSignIn = async (req, res, next) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decode = jwt.verify( req.headers.authorization, jwtSecretKey );
    req.user = decode;
  
    next();
  } catch ( err )
  {
    next(err)
  }
};
const isUser = async (req, res, next) => {
    try
    {
      const user = await UserDetails.findById( req.user.id );
    if (user.role !== 0) {
      res.send({
        access: false,
        error: "UnAuthorized Access",
      } );
        
      }
    else
    {
        next();
      }
  } catch (err) {
      res.send({error:"Error in User"})
     
  }
};
const isAdmin = async (req, res, next) => {
    try
    {
      const user = await UserDetails.findById( req.user.id );
      if ( user.role !== 1 )
      {
      
      res.send({
        access: false,
        error: "UnAuthorized Access",
      } );
        
      }
    else
      {
        next();
      }
  } catch (err) {
      res.send({error:"Error in Admin"})
     
  }
};

module.exports = { requireSignIn, isUser,isAdmin };
