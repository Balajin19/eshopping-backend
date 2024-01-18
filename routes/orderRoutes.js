const express = require("express");
const { isAdmin, requireSignIn, isUser } = require("../middleware/jwt");
const sendEmail = require("../middleware/sendinblue");
const orderMail = require("../helpers/orderMailContent");
const formatDate = require("../helpers/dateFormat");
const OrderDetails = require("../model/OrderModel");
const router = express.Router();

router.get("/", (req, res) => {
  const orders = {
    message: "Welcome to ORDER",
  };
  res.send(orders);
});

router.post("/addOrder/:id", requireSignIn, isUser, async (req, res, next) => {
  try {
    const { email, name, address, phone } = req.body.value;
    var refNumber = Math.round(Math.random() * 100000000);
    var date = formatDate();
    const order = new OrderDetails({
      buyer: req.params.id,
      products: req.body.cartItems,
      orderNo: refNumber,
      deliveryDate: date,
    });
    order.save();
    const subject = `Order Confirmation - Your Order with E-Shopping ${refNumber} has been successfully placed!`;
    const content = orderMail(
      name,
      order.orderNo,
      order.status,
      address,
      phone,
      order.deliveryDate
    );
    const sendmail = await sendEmail(email, subject, content);
    res.send({ order, success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/getOrders/:id", requireSignIn, async (req, res, next) => {
  try {
    const orders = await OrderDetails.find({ buyer: req.params.id })
      .populate("products", "-photo")
      .populate("buyer");
    res.send({ success: true, orders: orders });
  } catch (err) {
    next(err);
  }
});
router.delete("/cancel-Orders/:id", requireSignIn, async (req, res, next) => {
  try {
    const cancelOrder = await OrderDetails.findOneAndDelete({
      _id: req.params.id,
    }).populate("buyer", "-password");
    const status = "Cancel";
    const subject = `Cancellation of your Order ${cancelOrder?.orderNo} with E-Shopping!`;
    const content = orderMail(
      cancelOrder.buyer.name,
      cancelOrder.orderNo,
      status
    );
    const sendmail = await sendEmail(cancelOrder.buyer.email, subject, content);
    res.send({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    next(err);
  }
});
router.delete("/remove-Orders/:id", requireSignIn, async (req, res, next) => {
  try {
    const removeOrder = await OrderDetails.findOneAndDelete({
      _id: req.params.id,
    });
    res.send({ success: true, message: "Order removed successfully" });
  } catch (err) {
    next(err);
  }
});

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
});

router.put("/status/:id", requireSignIn, isAdmin, async (req, res, next) => {
  try {
    const orderStatus = await OrderDetails.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
      .populate("products", "-photo")
      .populate("buyer");
    const subject =
      orderStatus.status === "Cancel"
        ? `Cancellation of your Order ${orderStatus?.orderNo} with E-Shopping!`
        : `Order Status - Your Order with E-Shopping ${orderStatus?.orderNo} has been successfully ${orderStatus?.status}!`;
    const content = orderMail(
      orderStatus.buyer.name,
      orderStatus.orderNo,
      orderStatus.status,
      orderStatus.buyer.address,
      orderStatus.buyer.phone
    );
    const sendmail = await sendEmail(orderStatus.buyer.email, subject, content);
    res.send({ success: true, message: "Order status changed" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
