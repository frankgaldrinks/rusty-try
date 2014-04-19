module.exports = function(app,db,io){
  var indexController = require('../controllers/index')(db,io);

  app.get('/', indexController.index);
  app.get('/redirect', indexController.redirect);
  app.get('/place/:uuid', indexController.uuid);
  app.post('/createroom', indexController.createroom);
  app.post('/roomdata', indexController.roomdata);
  app.get('/admin', indexController.admin);
  app.post('/removeroom', indexController.removeroom);
  // app.post('/sort', indexController.sort);
};