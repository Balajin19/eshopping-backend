const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    buyer: {
      type: mongoose.ObjectId,
      ref: "user-details",
    },
    payment: {
      type: String,
      default: "Success",
      enum: ["Success", "Failed"],
    },
    status: {
      type: String,
      default: "Confirmed",
      enum: [
        "Confirmed",
        "Not Process",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancel",
      ],
    },
    orderNo: {
      type: Number,
    },
    deliveryDate: {
      type: Object,
    },
  },
  { timestamps: true }
);

const OrderDetails = mongoose.model("order", OrderSchema);
module.exports = OrderDetails;
