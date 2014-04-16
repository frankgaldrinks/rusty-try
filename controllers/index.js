var _ = require("underscore");
// global.items = [0,1,2,3,4,5,6];
global.items = ["Apricot","Banana","Cranberry","Date","Elderberry","Fig","Grape"];
global.draggable = {
  top: "0px",
  left: "0px"
};

exports.index = function (req, res) {
  res.render('index', {items: global.items, draggable: global.draggable});
};

exports.redirect = function (req, res) {
  res.send("<p>You were sent here after 5 seconds</p>")
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