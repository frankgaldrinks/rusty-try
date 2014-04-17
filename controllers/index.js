var _ = require("underscore");
// global.items = [0,1,2,3,4,5,6];
// global.items = ["Apricot","Banana","Cranberry","Date","Elderberry","Fig","Grape"];
// global.draggable = {
//   top: "0px",
//   left: "0px"
// };

module.exports = function (db) {
  functions = {};

  functions.index = function (req, res) {
    db.collection('data').findOne({}, function (err, doc) {
      if (err) throw err;
      console.dir(doc);
      res.render('index', {items: doc.items, draggable: doc.draggable});
    });
  };

  functions.redirect = function (req, res) {
    res.send("<p>You were sent here after 5 seconds</p>")
  };

  functions.uuid = function (req, res) {
    res.render('uuid', {nothing: "nothing"});
  };

  return functions;
};



// exports.sort = function (req, res) {
//   console.log(req.body.serial);
//   var newItems = req.body.serial;
//   _.map(newItems, function(num){ return parseInt(num) });
//   if (newItems.length !== items.length) {
//     res.status(404);
//     res.send("You deleted elements in the html!");
//   } else {
//     items = newItems;
//     res.send("Nothing");
//   }
  
// };