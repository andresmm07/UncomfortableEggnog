//helpers are a set of functions that work with the database.
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');
var db = require('../db/db.js');
var _ = require('underscore');

var SALT_WORK_FACTOR = 10;

/************************************************
                     Login Database Helpers
*************************************************/
exports.comparePassword = function (candidatePassword, hashPassword, cb) {
  bcrypt.compare(candidatePassword, hashPassword, cb);
};


exports.hashPassword = function (password, cb) {
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      cb(err);
    } else {
      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) {
          cb(err);
         } else {
          cb(null, hash);
         }
      });
    }
  });
};

/************************************************
                     User Database Helpers
*************************************************/


exports.findUserById = function (id, cb) {
  db.User.findOne(id, cb);
};

exports.findUserByUsername = function (username, cb) {
  db.User.findOne({
    username: username
  }).exec(cb);
};

exports.saveUser = function (user, cb) {
  //assumes server controller checked if username already exists in db
  var newUser = new db.User(user);
  newUser.save(cb);
};

exports.updateUser = function (userToUpdate, cb) {
  db.User.findOne({
    username: userToUpdate.currentUsername
  }, function (err, userInDB) {
    if (!err) {
      userInDB.username = userToUpdate.username;
      userInDB.email = userToUpdate.email;
      userInDB.website = userToUpdate.website;
      userInDB["first name"] = userToUpdate["first name"];
      userInDB["last name"] = userToUpdate["last name"];
      userInDB.password = userToUpdate.password || userToUpdate["current password"];
    }
    userInDB.save(cb);
  });
};


/********************************************
                     Package Database Helpers
*********************************************/

//find by title
exports.findPackageByTitle = function (title, cb) {
  db.PackageEntry.find({title: title}, cb);
};

exports.findPackagesByUserId = function (id, cb) {
  db.PackageEntry.find({userId: id}, cb);
};

exports.findPackageEntries = function (cb) {
  // finds all packages and sorts the files by like
  db.PackageEntry.find({}).sort({
    "likes": -1
  }).limit(10).exec(cb);
};

// we text indexed the file as it comes in
// here we pass it a term and it checks the db for it.
exports.searchPackages = function (term, cb) {
   db.PackageEntry.find({
     $text: { $search: term }
   }, {
     score: { $meta: "textScore" }
   })
   .sort({ score: {$meta: "textScore"}})
   .exec(function (e,d) {
     // passing cb error or data
     cb(e, d);
   });
};

exports.editPackage = function (req, cb) {
  var id = req.body._id;
  var user = req.user;
  db.PackageEntry.findById(id, function (err, pkg) {
    if (err) {
      // if there is an error, respond back with error obj
      cb({
        error: 'oops',
        err: err
      });
    }
    if (pkg.userId.toString() === user._id) {
      // takes the new package and extends the old package
      _.extend(pkg, req.body);
      // We then save the package
      pkg.save(cb);
    } else {
      cb({error: 'Not Your Package'});
    }
  });
};

exports.savePackage = function (user, entry, cb) {
  exports.findUserByUsername(user, function (err, user) {
    if (err) {
      console.log('Error finding user.');
      cb(err);
    } else {
      entry.userId = user._id;
      var packageEntry = new db.PackageEntry(entry);
      packageEntry.save(function (err, entry) {
        if (err) {
          console.log('Error saving package.' + err);
          cb(err);
        } else {
          cb(null, entry);
        }
      });
    }
  });
};

exports.findPackagesByUsername = function (username, cb) {
  // finds user, then finds the packages associated to user
  exports.findUserByUsername(username, function (err, user) {
    if (err) {
      console.log(err);
      cb(err);
    } else if (user === null) {
      console.error("No user by that name");
    } else {
      exports.findPackagesByUserId(user._id, cb);
    }

  });
};

exports.addReview = function (id, stars, review, cb) {
  db.PackageEntry.update({ _id: id },
    {
      $inc: {
        countReviews: 1,
        stars: stars
      },
      $push: {
        reviews: review
      }
    },
    function (err, packageEntry) {
    if (err) {
      cb(err);
    } else {
      cb(packageEntry);
    }
  });
};

exports.findPackageById = function (id, cb) {
  db.PackageEntry.find({_id: id}, function (err, packageEntry) {
    if (err) {
      cb(err);
    } else {
      cb(packageEntry);
    }
  });
};

exports.incrementPackageDownloads = function (id, cb) {
  db.PackageEntry.update({_id: id}, {$inc: {downloads: 1}}, function (err, packageEntry) {
    if (err) {
      cb(err);
    } else {
      cb(packageEntry);
    }
  });
};
