var controllers = require('../controllers/controllers.js');
var verifyUser = require('../middleware/middleware').verifyUser;
var sendUserData = require('../middleware/middleware').sendUserData;

module.exports = function (router, passport) {

/*************************************
                     Login Routes
**************************************/
  router.post('/login', controllers.loginUser);
  router.post('/signup', controllers.signupUser);
  router.get('/logout', controllers.logoutUser);

/**************************************
                Facebook Routes
***************************************/
  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  router.get('/auth/facebook/callback',
     passport.authenticate('facebook', {
         successRedirect : '/',
         failureRedirect : '/'
     }));

/*************************************
                Github Routes
*************************************/
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
   passport.authenticate('github', {
       successRedirect : '/',
       failureRedirect : '/'
   }));

/************************************
              Google Routes
*************************************/
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',
   passport.authenticate('google', {
       successRedirect : '/',
       failureRedirect : '/'
   }));

/*************************************
                     User Routes
**************************************/
  router.get('/api/userData', sendUserData);
  router.get('/users/:id', controllers.getUserInfo);
  router.get('/user/:username', controllers.getUserByUsername);
  router.get('/user/:username/verify', verifyUser, controllers.getUserByUsername);
  router.post('/user/:username/edit', verifyUser, controllers.editUser);


  /*************************************
                       Package Routes
  **************************************/
  router.get('/packages', controllers.fetchPackages);
  router.post('/packages', verifyUser, controllers.savePackageEntry);


  //======Default Route=========
  router.get('/*', function (req, res) {
    res.sendStatus(404);
  });
};
