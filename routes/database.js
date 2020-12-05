var express = require("express");
var router = express.Router();

var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "boardgame_shop",
});

// Example of a SELECT request {{{
// db.connect(function(err) {
//      if (err) throw err;
//      db.query("SELECT * FROM user", function (err, results, fields) {
//        if (err) throw err;
//        console.log("Result: ");
//        results.forEach(result => {
//          console.log(result);
//          console.log(result.first_name);
//        });
//      });
//    });
// Example of a SELECT request }}}

// router.get('/', function(req, res) {
//     var collection = db.get('videos');
//     collection.find({}, function(err, videos) {
//         if (err) {
//             throw err;
//         }
//         res.json(videos);
//     });
// });

// router.get('/:id', function(req, res) {
//     var collection = db.get('videos');
//     collection.findOne({ _id: req.params.id }, function(err, video){
//         if (err) {
//             throw err;
//         }
//         res.json(video);
//     });
// });

module.exports = router;
