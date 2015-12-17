
//controllers are request handers that work with routes.
var jwt = require('jsonwebtoken');
var helpers = require('../helpers/helpers');
var jwtKey = 'test';

/*************************************
                     Login Handlers
**************************************/

// TODO: refactor this to a users controller

exports.loginUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  //check username match
  helpers.findUserByUsername(username, function (err, user) {
    if (err) {
      console.log('There was an error logging in user.');
      res.sendStatus(500);
    } else if (!user) {
        console.log('Username was not found.');
        res.status(401).json({
          errorType: 'username',
          error: 'That username was not found.'
        });
    } else {

        helpers.comparePassword(password, user.password, function (err, isMatch) {
          if (err) {
            console.log('There was an error logging in user.');
            res.sendStatus(500);
          } else if (!isMatch) {
              console.log('User password did not match.');
              res.status(401).json({
                errorType: 'password',
                error: 'Incorrect Password.'
            });
          } else {
              // if successful, we encrypt the user object and send it out
              // as a token. This will be decrypted by the middleware and
              // applied to req
              var token = jwt.sign(user, jwtKey, {
                expiresIn: 9999999
              });
              res.json({
                success: true,
                token: token,
                username: user.username
              });
            }
          });
        }
    });
};


exports.signupUser = function (req, res) {
  //assumes req.password is a string
  var newUser = req.body;
  helpers.findUserByUsername(newUser.username, function (err, user) {
    if (user) {
      console.log('That username already exists.');
      res.status(200).json({
        errorType: 'username',
        error: 'That username already exists.'
      });
    } else {
      helpers.saveUser(newUser, function (err, user) {
        if (err) {
          console.log('There was an error saving user.');
          res.status(500).json({
            errorType: 'userSave',
            error: 'There was an error saving user.'
          });
        } else {
          // if successful, we encrypt the user object and send it out
          // as a token. This will be decrypted by the middleware and
          // applied to req
          console.log('user saved!: ', user);
          var token = jwt.sign(user, jwtKey, {
            expiresIn: 9999999
          });
          res.json({
            success: true,
            token: token,
            username: user.username
          });
        }
      });
    }
  });
};

exports.editUser = function (req, res) {
  helpers.findUserByUsername(req.body.currentUsername, function (err, user) {
    if (user) {
      console.log(req.body);
      helpers.comparePassword(req.body["current password"], user.password, function (err, isMatch) {
        if (err) {
          console.log('There was an error editing user.');
          res.sendStatus(500);
        } else if (!isMatch) {
            console.log('User password did not match.');
            res.status(401).json({
              errorType: 'password',
              error: 'Incorrect Password.'
          });
        } else {
          var userToUpdate = req.body;
          helpers.findUserByUsername(userToUpdate.username, function (err, user) {
            if (user && user.username !== userToUpdate.username) {
              res.status(200).json({
                errorType: 'username',
                error: 'That username already exists.'
              });
            } else {
                helpers.updateUser(userToUpdate, function (err, user) {
                if (err) {
                  console.log('There was an error saving user.');
                  res.status(500).json({
                    errorType: 'userSave',
                    error: 'There was an error saving user.'
                  });
                } else {
                  console.log('user saved!: ', user);
                  var token = jwt.sign(user, jwtKey, {
                    expiresIn: 9999999
                  });
                  res.json({
                    success: true,
                    token: token,
                    username: user.username
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.logoutUser = function (req, res) {
  console.log('logout');
  if (req.user) {
    req.logout();
    res.redirect('/');
  }
};


/*************************************
                     Package Handlers
**************************************/

// TODO: refactor this out to a packages controller
exports.fetchPackages = function (req, res) {
  helpers.findPackageEntries(function (err, packages) {
    if (err) {
      console.log('There was an error finding packages.');
      res.sendStatus(500);
    } else {
      console.log('Sending packages to client.');
      res.send(packages);
    }
  });
};

exports.fetchPackageById = function (req, res) {
  var id = req.params.id;
  //handle incorrect id
  if (typeof id !== 'number') {
    res.sendStatus(404);
  } else {
    helpers.findPackageById(id, function (err, packageEntry) {
      if (err) {
        console.log('There was an error finding package with ID: ' + id + '.');
        res.sendStatus(500);
      } else if (!packageEntry) {
          console.log('No entry found with ID: ' + id);
          res.sendStatus(404);
      } else {
         console.log('Sending package with ID ' + id + ' to client.');
         res.send(packages);
      }
    });
  }
};



exports.savePackageEntry = function (req, res) {
  //entry should be object with all relevant PackageEntry attributes
  var entry = req.body;
  var user = req.user;
  helpers.savePackage(user.username, entry, function (err, packageEntry) {
    if (err) {
      console.log('There was an error saving package.');
      res.sendStatus(500);
    } else {
      console.log('Saved entry to the database!');
      res.send(packageEntry);
    }
  });
};

/*************************************
                     User Handlers
**************************************/
exports.getUserInfo = function (req, res) {
  var id = req.params.id;
  helpers.findUserById(id, function (err, user) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.send(user);
  });
};

exports.getUserByUsername = function (req, res) {
  helpers.findUserByUsername(req.params.username, function (err, user) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    res.send(user);
  });
};


