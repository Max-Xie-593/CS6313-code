const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const session = require('express-session');

const mysql = require('mysql');
var sql_pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'root',
  database        : 'boardgame_shop'
});


const hash_string = (str) => crypto.createHash('sha512').update(str.normalize()).digest('hex');

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
  console.log(req.session.user_info);
  res.render('checkout');
});


// Sign In {{{
router.post('/signin/verify', function(req, res) {

  sql_pool.getConnection(function(err, db) {
    if (err) throw err;

    var credentials_select_sql = "SELECT * FROM credential WHERE "
      + "username='" + hash_string(req.body.username) + "' and "
      + "password='" + hash_string(req.body.PASSWORD) + "'";
    db.query(credentials_select_sql, function (err, result) {
      if (err) throw err;

      if (result.length != 1) {
        // TODO: Find a way better to indicate invalid username/password pair.

        res.redirect("/signin");
        return;
      }

      req.session.user_info = {
        "id" : result[0].user_id
      };
      var user_select_sql = "SELECT first_name, last_name FROM user WHERE "
        + "id='" + req.session.user_info.id + "'";
      db.query(user_select_sql, function (err, result) {
        if (err) throw err;

        // TODO: The session variable does not persist outside of this function
        // callback. Find a way for the session variable to persist.
        req.session.user_info.first_name = result[0].first_name;
        req.session.user_info.last_name = result[0].last_name;

      });

    });
    db.release();
    res.redirect("/");
  });

});
// Sign In }}}

// Sign Up {{{
router.post('/new/user', function(req, res) {
  if (req.body.PASSWORD.normalize() !== req.body.PASSWORD_check.normalize()) {
    throw "Passwords do not match!";
    // res.redirect('/signup');
    // return;
  }

  sql_pool.getConnection(function(err, db) {
    if (err) throw err; // Unable to connect

    const username_hash = hash_string(req.body.username);
    var user_insert_sql;

    db.query(
      "SELECT username FROM credential WHERE username='" + username_hash + "'",
      function (err, result) {
        if (err) throw err;

        if (result.length != 0) {
          throw "Username already exists!";
        }

        user_insert_sql = "INSERT INTO user "
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

          db.query(credential_insert_sql, function (err) {
            if (err) throw err;
          });
        });
    });

    db.release();
  });

  return res.redirect('/');
});
// Sign Up }}}

module.exports = router;
