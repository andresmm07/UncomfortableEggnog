// api/ route
var apiController = require('../controllers/apiController');
var verifyUser = require('../middleware/middleware').verifyUser;

module.exports = function (app) {
  app.get('/top10', apiController.topTen);
  app.get('/package/:packageName', verifyUser, apiController.getPackage);
  app.post('/package/:id', verifyUser, apiController.addReview);
  app.get('/download/:id', apiController.downloadPackage);
  app.get('/users/:userName/packages', apiController.getUserPackages);
  app.post('/search', apiController.searchTerm); // NOTE: No need to verify user here
  app.post('/package/:packageName/edit', verifyUser, apiController.editPackage);
  app.get('/package/:packageName/edit', verifyUser, apiController.isUserPackage);
};
