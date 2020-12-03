var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "boardgame_shop"
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/signin', function(req, res) {
  // TODO: If a user is signed in already, replace "sign in" and "sign up" with
  // "sign out"
  res.render('signin');
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.get('/cart', function(req, res) {
  // TODO: Prior to going to the cart page, check if a user is signed in. If not
  // go to sign in page
  res.render('cart');
});

router.get('/history', function(req, res) {
  // TODO: Prior to going to the history page, check if a user is signed in. If
  // not go to sign in page
  res.render('history');
});

router.get('/checkout', function(req, res) {
  // TODO: Prior to going to the checkout page, check if a user is signed in. If
  // not go to sign in page
  res.render('checkout');
});


// Database {{{
router.post('/new/user', function(req, res) {
  if (req.body.PASSWORD.normalize() !== req.body.PASSWORD_check.normalize()) {
    res.redirect('/signup');
    return;
  }

  db.connect(function(err) {
       if (err) throw err;
       db.query("SELECT username FROM credential", function (err, result) {
         if (err) throw err;
         console.log("Result: ");
         console.log(result);
       });
   });
});
// Database }}}


module.exports = router;
