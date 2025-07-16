const express = require('express')
const router = express.Router()
const cartLayout = "../views/layouts/cart.ejs"

router.get('/', async (req, res) => {
  try {
    res.render('cart', { layout: cartLayout });  // render to a template
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});



module.exports = router