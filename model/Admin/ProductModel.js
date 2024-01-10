const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.ObjectId,
    ref: "category",
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Boolean,
  },
 
},{timestamps:true});

const ProductDetails = mongoose.model("Product", ProductSchema);
module.exports = ProductDetails;
