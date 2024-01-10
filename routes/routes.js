const express = require("express");
const speakeasy = require("speakeasy");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require( "../helpers/authHelper.js" );
const { generateOTP, generateOtp, verifyOtp } = require( "../helpers/optController" );
const { requireSignIn, isAdmin, isUser } = require( "../middleware/jwt.js" );
const sendEmail = require( "../middleware/sendinblue" );
const sendMail = require( "../middleware/sendinblue" );
const OtpDetails = require( "../model/OtpModel" );
const UserDetails = require( "../model/UserModel.js" );
const email = process.env.AUTH_EMAIL;
router.get("/", (req, res) => {
  const users = {
    message: "Welcome to E-SHOPPING WEBSITE",
  };

  res.send(users);
});
router.get("/users", async(req, res) => {
    const allUsers = await UserDetails.find().populate();

  res.send(allUsers);
});

router.post( "/register", async ( req, res,next ) =>
{
    try
    {
        const { name, email, password, phone, address,role } = req.body;
        const existUser = await UserDetails.findOne( { email } );
        if ( existUser )
        {
            throw new Error(  "User Already Exists!"  )
        }
        const hashedPassword = await hashPassword( password );
        const addUser = await new UserDetails( {
            name, email, password: hashedPassword, phone, address,role
        } ).save();
        res.send( { addUser, message: "Registered Successfully!",success:true } );
    }
    catch ( err )
    {
        next(err)
    }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existUser = await UserDetails.findOne({ email });
      if (!existUser) {
        throw new Error("Email is not Registered!");
      }
      const matchPassword = await comparePassword(password, existUser.password);
      if ( !matchPassword )
      {
            throw new Error("Invalid password")
}

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
   
      const token = jwt.sign({ id: existUser._id }, jwtSecretKey, {
        expiresIn: "1h",
      });
    const user = await UserDetails.findOne({ email }).populate("cartItems").select("-password");

       res.send({ user, token, message: "Loggedin Successfully!", success: true });
  } catch ( err )
  {
    next(err);
  }
} );
router.get( '/user', async ( req, res,next ) =>

{
  try
  {
    
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decode = jwt.verify( req.headers.authorization, jwtSecretKey );

    const getUser = await UserDetails.findById( {
      _id: decode.id,
    } ).populate("cartItems");
    res.send({ user: getUser, token: req.headers.authorization });
  }
  catch ( err )
  {
    next(err)
  }
} )
router.get( '/user-auth', requireSignIn,isUser, ( req, res )=>{
  res.send({access:true})
} )
router.get( '/admin-auth', requireSignIn, isAdmin, ( req, res ) =>
{
  res.send({access:true})
} )


router.put("/update-profile", async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existUser = await UserDetails.findOne({ email });
       const hashedPassword = await hashPassword(password);
    const user = await UserDetails.findByIdAndUpdate(
      { _id: existUser._id },
      {
        name: name || existUser.name,
        email: email || existUser.email,
        password: hashedPassword || existUser.password,
        phone: phone || existUser.phone,
        address: address || existUser.address,
      },
      { new: true }
    );
   
    res.send({
      user,
      success: true,
      message: "Profile updated Successfully!",
    });
  } catch ( err )
  {
     res.send({
       success: false,
       message: "Error in update profile!",
     });
    next(err);
  }
});
 router.get("/get-cartItems/:id", async (req, res, next) => {
   try {
     if ( req.params.id )
     {
      var user = await UserDetails.findById( { _id: req.params.id } ).populate(
         "cartItems")
     }
     else{
       throw new Error("Something went wrong!");
     }
     res.send({
       success: true,
       message: "Getting cartItems successfully!",
       user
     });
   } catch (error) {
     next(error);
   }
 });
 router.post("/add-cartItem/:id", async (req, res, next) => {
  try {
    let user;
    user = await UserDetails.findById({ _id: req.params.id }).populate(
      "cartItems"
    );
    let existCart = user.cartItems.find((value) => value._id.toString() === req.body._id);
    if (existCart) {
      throw new Error("Product already added in cart!");
    }
    user.cartItems.push(req.body);
    await user.save();
    const cartItems = await UserDetails.findById({ _id: req.params.id }).populate(
      "cartItems"
    )
    res.send({
      success: true,
      message: "Product added in cart successfully!",
    });
  } catch (error) {
    next(error);
  }
 } );
router.patch( "/delete-cartItem/:id", async ( req, res, next ) =>
{
  try{
  const existUser = await UserDetails.findById({_id:req.params.id});
  const { _id } = req.body;
  existUser.cartItems.pull({
    _id,
  });
    await existUser.save();
    const user = await UserDetails.findById( req.params.id ).populate( "cartItems" );
    
  res.send({user,message:"CartItem deleted successfully"});
  }
  catch( err ){
    next(err)
  };
} )
router.patch("/qty-update/:uid/:pid", async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const { quantity } = req.body;
    const existUser = await UserDetails.findById({ _id: uid }).populate(
      "cartItems"
    );
    const cart = existUser.cartItems.find(
      (item) => item._id.toString() === pid
    );
    cart.quantity = quantity;
    await existUser.save();
    const user = await UserDetails.findByIdAndUpdate( { _id: uid }, { existUser }, { new: true } );

    res.send({
      user,
      success: true,
      message: "Product Quantity updated successfully!",
    });
  } catch (err) {
    next(err);
    res.send({ success: false, message: "Error in product quantity update" });
  }
});
router.post( "/generate-otp", async ( req, res,next) =>

{
  try
  {
    const { email } = req.body
    const userExist = await UserDetails.findOne( { email } );

    if ( !userExist )
    {
      throw new Error( "Invalid Email" );
    }
    const otp = generateOtp();
   
   const sendmail = await sendEmail({otp});
 
    res.send( {success:true,otp} );

  }
  catch ( err )
  {
    next( err );
   
  }
  })
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { otp } = req.body;
    
    const verify = verifyOtp(otp);
   
    if ( !verify )
    {
      throw new Error("Invalid OTP")
    }
   
    res.send({ message:"verified",verify });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
