var jwt = require('jsonwebtoken');
// TODO: refactor jwtkey out
var jwtKey = 'test';

module.exports = {
  verifyUser: function (req, res, next) {
    console.log('verify user');
    // Pull token out of header
    var token = req.headers.token;
    if (token) {
      // pass token to jwt.verify to decrypt token
      jwt.verify(token, jwtKey, function (err, decoded) {
        if (err) {
          res.redirect('/');
        } else {
          // when decoded, attach to req
          req.user = decoded;
          next();
        }
      });
    } else {
      res.redirect('/');
    }
  },

  isLoggedIn: function (req, res, next) {
    console.log("is logged in");
   // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      console.log('is authenticated');
      return next();
    }

   // if they aren't redirect them to the home page
   res.redirect('/');
 }
};