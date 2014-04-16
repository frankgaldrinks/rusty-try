var indexController = require('../controllers/index');

module.exports = function(app){
  app.get('/', indexController.index);
  app.get('/redirect', indexController.redirect);
  // app.post('/sort', indexController.sort);
};