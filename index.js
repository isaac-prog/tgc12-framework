const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

const session = require('express-session')
const flash = require('connect-flash')

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

// set up sessions
app.use(session({
  'secret': 'keyboard cat',
  'resave': false,
  saveUninitialized: true
}))

// setup flash
app.use(flash());

// middleware
app.use(function(req,res,next){
  // res.locals refers to an object which keys are available in HBS files
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

async function main() {
 
  app.use('/', landingRoutes);
  app.use('/products', productRoutes)

}

main();

app.listen(3000, () => {
  console.log("Server has started");
});