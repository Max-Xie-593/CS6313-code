var express = require('express');
var router = express.Router();

//var monk = require('monk');
//var db = monk('localhost:27017/vidzy');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Express' });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

router.get('/history', function(req, res, next) {
  res.render('history', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'Express' });
});

module.exports = router;
