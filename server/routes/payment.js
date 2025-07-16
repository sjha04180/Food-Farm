const express = require('express')
const router = express.Router()
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert ₹ to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,

  };

  try {
    const order = await instance.orders.create(options);
    res.json({order, 
      razorpay_key: process.env.RAZORPAY_KEY_ID});
  } catch (err) {
    console.error("Order creation failed", err);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
