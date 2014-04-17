module.exports = function(app,db){
  var indexController = require('../controllers/index')(db);

  app.get('/', indexController.index);
  app.get('/redirect', indexController.redirect);
  app.get('/place/:uuid', indexController.uuid);
  app.post('/createroom', indexController.createroom);
  // app.post('/sort', indexController.sort);
};