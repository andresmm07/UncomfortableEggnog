var jwt = require('jsonwebtoken');
// TODO: refactor jwtkey out
var jwtKey = 'test';

module.exports = {
  verifyUser: function (req, res, next) {
    // Pull token out of header
    var token = req.headers.token;
    if (req.isAuthenticated()) {
      console.log('is authenticated');
      return next();
    } else if (token) {
      console.log("TOKEN!");
      // pass token to jwt.verify to decrypt token
      jwt.verify(token, jwtKey, function (err, decoded) {
        if (err) {
          console.log("ERR!", err);
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

  sendUserData: function (req, res) {
    if (req.user === undefined) {
        res.json({});
    } else {
        res.json({
            username: req.user
        });
    }
  }
};
