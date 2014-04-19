var _ = require("underscore");
// global.items = [0,1,2,3,4,5,6];
//global.items = ["Apricot","Banana","Cranberry","Date","Elderberry","Fig","Grape"];
defaultitems = ["Create More!"];
defaultdraggable = {
  top: "0px",
  left: "0px"
};

module.exports = function (db, io) {
  functions = {};
  var $data = db.collection('data');

  functions.index = function (req, res) {
    $data.find({},{name: true}).sort({name: 1}).toArray(function (err, docs) {
      if (err) throw err;
      console.dir(docs);
      res.render('index', {docs: docs});
    });
  };

  functions.admin = function (req, res) {
    $data.find({},{name: true}).sort({name: 1}).toArray(function (err, docs) {
      if (err) throw err;
      console.dir(docs);
      res.render('admin', {docs: docs});
    });
  };

  //use the io device and then send a remove/ban to people in that room

  functions.removeroom = function (req, res) {
    var room = req.body.room;

    $data.remove({name: room}, function (err, removed) {
      if (err) throw err;
      console.log(removed);
      res.send("success");
      var message = "<p>This room has been deleted</p>";
      message += "<meta id='redirect' http-equiv='refresh' content='3; url=/' />"
      io.sockets.in(room).emit('roomdeleted', { message: message } );
    });
  };

  functions.redirect = function (req, res) {
    res.send("<p>You were sent here after 5 seconds</p>")
  };

  functions.uuid = function (req, res) {
    var uuid = req.params.uuid;
    $data.count({name: uuid}, function (err, result) {
      if (result > 0) {
        $data.findOne({name: uuid}, function (err, doc) {
          if (err) throw err;
          res.render('uuid', {uuid: uuid, items: doc.items, draggable: doc.draggable});
        });
      } else {
        $data.insert({name: uuid, items: defaultitems, draggable: defaultdraggable}, function(err, inserted) {
          if (err) throw err;
          res.render('uuid', {uuid: uuid, items: defaultitems, draggable: defaultdraggable});
        });
      }
    });
  };

  functions.createroom = function (req, res) {
    res.redirect('/place/' + req.body.room);
  };

  functions.roomdata = function (req, res) {
    var uuid = req.body.uuid;
    
    $data.findOne({name: uuid}, function (err, doc) {
      if (err) throw err;
      var renderobj = {uuid: uuid, items: doc.items, draggable: doc.draggable};
      res.app.render('uuidajax', renderobj, function (err, html) {
        res.send(html);
      });
    });
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