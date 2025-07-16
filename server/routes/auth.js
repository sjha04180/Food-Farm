const express = require('express')
const router = express.Router()

const session = require('express-session');
const passport = require('passport');
require('./auth'); // where you configured Google Strategy

router.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());


// Trigger Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback URL
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
 res.render('dashboard', {
    user: req.user  // 👈 pass the user to the template
  });

}
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send('You are not Logged IN');
}

router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', {
    user: req.user  // 👈 pass the user to the template
  });
});


module.exports = router