var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/socketui', function(err, db) {
    "use strict";
    if(err) throw err;

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('./lib/sockets')(server,db);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'Jquery UI Socket.io');
    res.set('X-Made-By', 'frankgaldrinks');
    next();
  });
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res) {
  res.status(404);
  res.render("404");
})

app.locals.pretty = true;
app.locals.title = "Jquery UI Socket Test";

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes')(app,db,io);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

});
