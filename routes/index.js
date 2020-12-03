const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const mysql = require('mysql');
const db = mysql.createConnection({
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
    throw "Passwords do not match!";
    // res.redirect('/signup');
    // return;
  }

  // db.connect(function(err) {
  //   if (err) throw err;
  //   var sql = "INSERT INTO user SET ?";
  //   db.query(sql, {"first_name" : req.body.first_name, "last_name" : req.body.last_name}, function (err, result) {
  //     if (err) throw err;
  //     console.log("INSERT YAY");
  //     console.log(result.insertId);
  //   });
  // });

  db.connect(function(err) {
    if (err) throw err;

    const hash_string = (str) => crypto.createHash('sha512').update(str.normalize()).digest('hex');

    const username_hash = hash_string(req.body.username);
    db.query(
      "SELECT username FROM credential WHERE username='" + username_hash + "'",
      function (err, result) {
        if (err) throw err;

        if (result.length != 0) {
          throw "Username already exists!"
        }

        var user_insert_sql = "INSERT INTO user "
          + "(first_name, last_name) VALUES ('"
          + req.body.first_name + "', '"
          + req.body.last_name +"')";
        db.query(user_insert_sql, function (err, result) {
          if (err) throw err;

          var credential_insert_sql = "INSERT INTO credential "
            + "(username, user_id, PASSWORD) VALUES ('"
            + username_hash + "', '"
            + result.insertId + "', '"
            + hash_string(req.body.PASSWORD) + "')";
          db.query(credential_insert_sql, function (err) { if (err) throw err; });
        });
      }
    );
  });

  res.redirect('/');
});
// Database }}}


module.exports = router;
