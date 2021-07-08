const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

const session = require('express-session')
const flash = require('connect-flash')

// session file store
const FileStore = require('session-file-store')(session);

// include in csurf
const csrf = require('csurf')


// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// load in our route files
const landingRoutes = require('./routes/landing'); 
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const cloudinaryRoutes = require('./routes/cloudinary');
const shoppingCartRoutes = require('./routes/shoppingCart')

// set up sessions
app.use(session({
  'store': new FileStore(),
  'secret': process.env.SESSION_SECRET,
  'resave': false,
  saveUninitialized: true
}))

// setup flash
app.use(flash());

// flash middleware
app.use(function(req,res,next){
  // res.locals refers to an object which keys are available in HBS files
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

// put the user data from the session into res.locals (any variables
// inside res.locals is available to the HBS file)
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

app.use(csrf());

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      console.log("going next");
      next()
  }
});

app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken()
  next();
})



async function main() {
 
  app.use('/', landingRoutes);
  app.use('/products', productRoutes)
  app.use('/users', userRoutes)
  app.use('/cloudinary', cloudinaryRoutes)
  app.use('/shoppingCart', shoppingCartRoutes)

}

main();

app.listen(3000, () => {
  console.log("Server has started");
});