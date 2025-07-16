const express = require('express')
const router = express.Router()
const ITEM = require('../models/items')


// define the home page route
router.get('/', async (req, res) => {
const category = 'fruits';
  const items = await ITEM.find({ category }); 
  res.render('index', { items });  // ✅ Pass items to EJS
})

router.get('/category/:name', async (req, res) => {
  const category = req.params.name; // e.g., 'fruits'

  try {
    const items = await ITEM.find({ category }); // strictly matching
    res.render('index', { items });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get("/payment-success", async (req, res) => {
  const id = req.query.payment_id;
   res.render('payment_success', {id})
});


module.exports = router
