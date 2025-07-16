const express = require('express')
const router = express.Router()
const loginLayout = "../views/layouts/login.ejs"

router.get('/', (req, res) => {
    res.render('login',  { layout: loginLayout })
})




module.exports = router