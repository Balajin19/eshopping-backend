const { ObjectId } = require( "mongodb" );
const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
  {
    avatar: {
      data: Buffer,
      contentType: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      requird: true,
    },
    address: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    role: {
      type: Number,
    },
    cartItems: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);


const UserDetails = mongoose.model(
  "user-details",
  UsersSchema
);
module.exports = UserDetails;