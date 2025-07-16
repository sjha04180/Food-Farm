require('dotenv').config();

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const PORT = 3000 || process.env.PORT;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Connecting database
connectDB();
// parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

//For routes
app.use("/", require('./server/routes/main'))
app.use('/items', require('./server/routes/items'))
app.use('/all', require('./server/routes/allProducts'))
app.use('/cart', require('./server/routes/cart'))
app.use('/create-order', require('./server/routes/payment'))
app.use('/login', require('./server/routes/login'))
app.use('/auth', require('./server/routes/auth'))
app.use('/dashboard', require('./server/routes/dashboard'))


// For session handling
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // You can save user info in DB here
    return done(null, profile);
  }
));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
