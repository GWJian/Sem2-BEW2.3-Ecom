const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      let myOrder = await Order.create({
        user: req.user._id,
        items: cart.items,
        total: cart.total,
      });

      await myOrder.save();

      //then empty the cart
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ msg: "Checkout successfully" });
    } else {
      return res.json({ msg: "Your cart is empty" });
    }
  } catch (e) {
    return res.json({ msg: "No cart found", e });
  }
});

//get all orders
router.get("/", auth, async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user._id });
    if (orders && orders.length >= 1) return res.json(orders);
    return res.json({ msg: "Order is empty" });
  } catch (e) {
    return res.json({ e, msg: "No orders found" });
  }
});

module.exports = router;
