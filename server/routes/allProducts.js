const express = require('express')
const router = express.Router()
const ITEM = require('../models/items')
const allProductsLayout = "../views/layouts/allProducts.ejs"

router.get('/', async (req, res) => {
  try {
    const items = await ITEM.find(); // fetch all items
    res.render('AllProducts', { items, layout: allProductsLayout });  // render to a template
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query; 
  category = query;
  try {
    const items = await ITEM.find({ category }); // strictly matching
   res.render('AllProducts', { items, layout: allProductsLayout });  // render to a template
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});



module.exports = router