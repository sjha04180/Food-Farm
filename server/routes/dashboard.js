const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

         res.render('dashboard', {
    user: req.user  // 👈 pass the user to the template
  });
    
})



module.exports = router