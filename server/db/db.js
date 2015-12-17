var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/taser';
var helpers = require('../helpers/helpers');

mongoose.connect(dbUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function (cb) {
  console.log('Connected to db!');
});

//===========Schemas===========
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  "first name": {
    type: String,
    required: false
  },
  "last name": {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false,
    default: ''
  },
  facebook: {
    id: String,
    token: String,
    name: String
  },
  github: {
    id: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    name: String
  },
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageEntry"
  }]
});


var PackageEntrySchema = new mongoose.Schema({
  title: String,
  stars: {
    type: Number,
    default: 0
  },
  countReviews: {
    type: Number,
    default: 0
  },
  reviews: [String],
  downloads: {
    type: Number,
    default: 0
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  description: String,
  packageContents: mongoose.Schema.Types.Mixed,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// ==== Search ======

PackageEntrySchema.index({
  "$**": 'text'
}, {
  name: "TextIndex",
  weights: {
    title: 1,
    description: 1
  }
});


//===========Models===========
var User = mongoose.model('User', UserSchema);
var PackageEntry = mongoose.model('PackageEntry', PackageEntrySchema);


//===========Encryption=========

UserSchema.pre('save', function (next, done) {
  helpers.hashPassword(this.password, function (err, hash) {
    if (err) {
      next(err);
    } else {
      this.password = hash;
      next();
    }
  }.bind(this));
});


module.exports.db = db;
module.exports.User = User;
module.exports.PackageEntry = PackageEntry;
