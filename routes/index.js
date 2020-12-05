const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const session = require('express-session');

const mysql = require('mysql');
const { brotliDecompress } = require('zlib');
var sql_pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'root',
  database        : 'boardgame_shop'
});


const hash_string = (str) => crypto.createHash('sha512').update(str.normalize()).digest('hex');


function is_admin(user_id, callback) {
  sql_pool.query(`SELECT user_id FROM admin WHERE user_id='${user_id}'`,
    function(err, result) {
      if (err) throw err;

      callback(null, result.length === 1);
    }
  )
}

/* GET home page. */
router.get('/', function(req, res) {

  sql_pool.getConnection(function(err, db) {
    if (err) throw err;

    var credentials_select_sql = "SELECT * FROM product";
    db.query(credentials_select_sql, function (err, result) {
      if (err) throw err;
      db.release();
      if (!req.session.user_info) {
        return res.render('index', {products : result});
      }
      is_admin(req.session.user_info.id, function(err, isadmin) {
        if (err) throw err;
        res.render('index', {
          first_name : req.session.user_info.first_name,
          last_name: req.session.user_info.first_name,
          admin : isadmin,
          products : result
        });
      });
    });
  });
});
/* GET new Item Page. */
router.get('/new/item', function(req, res) {

  if (!req.session.user_info) {
    return res.redirect('/');
  }

  is_admin(req.session.user_info.id, function(err, result) {
    if (err) throw err;

    if (!result) {
      return res.redirect('/');
    }

    res.render('newitem', {
      first_name : req.session.user_info.first_name,
      last_name: req.session.user_info.first_name,
      admin : true
    });
  });
});


// Add New Item to Database {{{
router.post('/new/item',
  [
    body("item_name")
    .not().isEmpty()
    .withMessage("Item Name cannot be empty.")
    .trim(),

    body("item_price")
    .trim()
    .escape()
    .isFloat()
    .withMessage("Invalid Item Price.")
    .toFloat(),

    body("item_img")
    .not().isEmpty()
    .withMessage("Item Image Path cannot be empty.")
    .trim()
    .escape(),

    body("item_description")
    .not().isEmpty()
    .withMessage("Item Description cannot be empty.")
    .trim()
  ],
  function(req, res) {
    if (!req.session.user_info) {
      return res.redirect('/');
    }

    is_admin(req.session.user_info.id, function(err, result) {
      if (err) throw err;

      if (!result) {
        return res.redirect('/');
      }

      if (!validationResult(req).isEmpty()) {
        return res.render('newitem', {
          error_message: validationResult(req).errors.map(item => item.msg),
          first_name : req.session.user_info.first_name,
          last_name: req.session.user_info.first_name,
          admin : result
        });
      }


      sql_pool.query("INSERT INTO product "
        + "(name, cents_price, image_path, description) VALUES ("
          + `'${req.body.item_name}', `
          + `'${req.body.item_price * 100}', `
          + `'${req.body.item_img}', `
          + `'${req.body.item_description}'`
        + ')'
      );

      return res.redirect('/');
    });
  }
);
// Add New Item to Database }}}


// Edit existing Item in Database {{{
router.get('/item/:id/edit', function(req, res) {
  sql_pool.query("SELECT * FROM product WHERE "
  + "id='" + req.params.id + "'",function(err,product){
    if (err) throw err;
    // res.redirect('/');
    res.render('edit_item',{
      item: product[0]
    });
  });
});

router.post('/item/:id/',
  [
    body("item_name")
    .not().isEmpty()
    .trim()
    .escape(),

    body("item_price")
    .not().isEmpty()
    .trim()
    .escape()
    .isFloat().toFloat(),

    body("item_img")
    .not().isEmpty()
    .trim()
    .escape(),

    body("item_description")
    .not().isEmpty()
    .trim()
    .escape()
  ],
  function(req, res) {
    if (!req.session.user_info) {
      return res.redirect('/');
    }

    if (!validationResult(req).isEmpty()) {
      return res.render('edit_item', {
        error_message: "Invalid Input Given!",
        first_name : req.session.user_info.first_name,
        last_name: req.session.user_info.first_name,
        admin : result
      });
    }

    is_admin(req.session.user_info.id, function(err, result) {
      if (err) throw err;

       if (!result) {
         return res.redirect('/');
       }

      sql_pool.query("UPDATE product SET "
        + "name = " + `'${req.body.item_name}', `
        + "cents_price = " + `'${req.body.item_price * 100}', `
        + "image_path = " + `'${req.body.item_img}', `
        + "description = " + `'${req.body.item_description}' `
        + "WHERE id = " + "'" + req.params.id + "'"
      );

      return res.redirect('/');
    });
  }
);
// Edit existing Item in Database }}}

// Delete Item from Database {{{
router.delete('/item/:id',function(req,res) {
  sql_pool.query("DELETE FROM product WHERE "
    + "id = " + "'" + req.params.id + "'",
    function(err,result){
      if (err) throw err;
      res.redirect('/');
    });
});
// Delete Item from Database }}}


router.get('/signin', function(req, res) {

  if (req.session.user_info) {
    return res.redirect('/');
  }

  res.render('signin');
});

router.get('/signup', function(req, res) {

  if (req.session.user_info) {
    return res.redirect('/');
  }

  res.render('signup');
});

router.get('/cart', function(req, res) {
  if (!req.session.user_info) {
    return res.redirect('/signin');
  }

  res.render('cart', {
    first_name : req.session.user_info.first_name,
    last_name: req.session.user_info.first_name
  });
});

router.get('/history', function(req, res) {
  if (!req.session.user_info) {
    return res.redirect('/signin');
  }

  res.render('history', {
    first_name : req.session.user_info.first_name,
    last_name: req.session.user_info.first_name
  });
});

router.get('/checkout', function(req, res) {
  if (!req.session.user_info) {
    return res.redirect('/signin');
  }

  console.log(req.session);
  res.render('checkout', {
    first_name : req.session.user_info.first_name,
    last_name: req.session.user_info.first_name
  });
});

// Sign Out {{{
router.get('/signout', function(req, res) {
  req.session.destroy(function(err){
    if (err) throw err;
    return res.redirect('/');
  });
});
// Sign Out }}}

// Sign In {{{
router.post('/signin',
  [
    body("username")
    .not().isEmpty()
    .withMessage("Username cannot be empty.")
    .trim()
    .escape(),

    body("PASSWORD")
    .not().isEmpty()
    .withMessage("Password cannot be empty.")
    .trim()
    .escape()
  ],
  function(req, res) {

    if (!validationResult(req).isEmpty()) {
      return res.render('signin', {
        error_message: validationResult(req).errors.map(item => item.msg)
      });
    }

    sql_pool.getConnection(function(err, db) {
      if (err) throw err;

      var credentials_select_sql = "SELECT * FROM credential WHERE "
        + "username='" + hash_string(req.body.username) + "' and "
        + "password='" + hash_string(req.body.PASSWORD) + "'";
      db.query(credentials_select_sql, function (err, result) {
        if (err) throw err;

        if (result.length != 1) {
          return res.render('signin', {error_message: "Invalid User/Password Combination!"});
        }

        req.session.user_info = {
          "id": result[0].user_id
        };
        var user_select_sql = "SELECT first_name, last_name FROM user WHERE "
          + "id='" + result[0].user_id + "'";
        db.query(user_select_sql, function (err, result) {
          if (err) throw err;

          req.session.user_info.first_name = result[0].first_name;
          req.session.user_info.last_name = result[0].last_name;
          db.release();

          res.redirect('/');
        });
      });
    });
  }
);
// Sign In }}}

// Sign Up {{{
router.post('/signup',
  [
    body("username")
    .not().isEmpty()
    .withMessage("Username cannot be empty.")
    .trim(),

    body("first_name")
    .not().isEmpty()
    .withMessage("First name cannot be empty.")
    .trim()
    .escape(),

    body("last_name")
    .not().isEmpty()
    .withMessage("Last name cannot be empty.")
    .trim()
    .escape(),

    body("PASSWORD")
    .isLength({min: 1})
    .withMessage("Password required.")
    .custom((val, {req}) => {
      if (val.normalize() !== req.body.PASSWORD_check.normalize()) {
        throw new Error("Passwords do not match");
      }
      else {
        return val;
      }
    }),
  ],
  function(req, res) {

    if (!validationResult(req).isEmpty()) {
      return res.render('signup', {
        error_message: "Invalid Information Given!"}
      );
    }
    return res.render('signup')

    sql_pool.getConnection(function(err, db) {
      if (err) throw err; // Unable to connect

      db.query(
        "SELECT username FROM credential WHERE username='" + req.body.username + "'",
        function (err, result) {
          if (err) throw err;

          if (result.length != 0) {
            return res.render('signup', {error_message: "Username already exists!"});
          }

          const user_insert_sql = "INSERT INTO user "
            + "(first_name, last_name) VALUES ('"
            + req.body.first_name + "', '"
            + req.body.last_name +"')";


          db.query(user_insert_sql, function (err, result) {
            if (err) throw err;

            var credential_insert_sql = "INSERT INTO credential "
              + "(username, user_id, PASSWORD) VALUES ('"
              + req.body.username + "', '"
              + result.insertId + "', '"
              + hash_string(req.body.PASSWORD) + "')";

            db.query(credential_insert_sql, function (err) {
              if (err) throw err;

              db.release();
              res.redirect(307, '/signin');
            });
          });
      });
    });
  }
);
// Sign Up }}}

module.exports = router;
