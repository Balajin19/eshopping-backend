const express = require("express");
const path = require("path");
const { isAdmin, requireSignIn, isUser } = require("../middleware/jwt");
const OrderDetails = require("../model/OrderModel");
const router = express.Router();

router.get("/", (req, res) => {
  const orders = {
    message: "Welcome to ORDER",
  };
  res.send(orders);
});

router.post("/addOrder/:id", requireSignIn, isUser, async (req, res) => {
  try {

    const order = new OrderDetails({
      buyer: req.params.id,
      products: req.body,
    });
    order.save();
    res.send(order);
  } catch (err) {
    res.send({ message: "Error in adding orders" });
  }
});

router.get("/getOrders/:id", requireSignIn, async (req, res) => {
  try {
    const orders = await OrderDetails.find({ buyer: req.params.id })
      .populate("products", "-photo")
      .populate("buyer");
    res.send({ success: true, orders: orders });
  } catch (err) {
    res.send({ message: "Error in getting orders" });
  }
} );

router.get("/allOrders", requireSignIn, isAdmin, async (req, res, next) => {
  try {
    const allOrders = await OrderDetails.find({})
      .populate("products", "-photo")
      .populate("buyer")
      .sort({ createdAt: -1 });
    res.send({ success: true, orders: allOrders });
  } catch (err) {
    next(err);
  }
} );

router.put("/status/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const allOrders = await OrderDetails.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
      .populate("products", "-photo")
      .populate("buyer");
  } catch (err) {
    res.send({ message: "Error in getting all orders" });
  }
});

module.exports = router;
