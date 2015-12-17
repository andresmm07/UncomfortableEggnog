var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../server/app');
var db = require('../../server/db/db');
var User = require('../../server/db/db').User;
var PackageEntry = require('../../server/db/db').PackageEntry;
var searchPackages = require('../../server/helpers/helpers').searchPackages;

xdescribe('search', function (done) {
  before(function (done) {
    var packages = [
      {
        title: "Nest Package",
        reviews: [
          "One of the best packages ever",
          "I love this package!"
        ],
        description: "The best home control system that money can buy",
        packageContents: {
          "hello": "world"
        }
      },
      {
        title: "Kyle Cho Package",
        reviews: [
          "One of the best packages ever",
          "I love this package!"
        ],
        description: "Be more like the korean super star that is kyle cho",
        packageContents: {
          "hello": "world"
        }
      },
      {
        title: "Coffee Package",
        reviews: [
          "One of the best packages ever",
          "I love this package!"
        ],
        description: "The essential nest package",
        packageContents: {
          "hello": "world"
        }
      },
      {
        title: "Ninja security package",
        reviews: [
          "One of the best packages ever",
          "I love this package!"
        ],
        description: "The essential nest package",
        packageContents: {
          "hello": "world"
        }
      }
    ];
    var fred = new User({
      username: "freddy",
      password: '1234',
      email: "freddy@fred.com",
      "first name": "fred",
      "last name": "ballers",
      website: "www.fred.io",
      facebook: {
        id: "123",
        token: "1234",
        name: "fred ballers"
      }
    });
    fred.save(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        var batchPackages = packages.map(function (pkg) {
          pkg.userId = user.id;
          return pkg;
        });
        PackageEntry.collection.insert(batchPackages, function (err, save) {
          console.log('Packages added');
          done();
        });
      }
    });
  });

  after(function (done) {
    User.remove({}, function () {
      PackageEntry.remove({}, function () {
        done();
      });
    });
  });

  it('before should add our packages', function (done) {
    PackageEntry.find({}, function (err, data) {
      done();
    });
  });

  it('should return the nest package when we search for it', function (done) {
    searchPackages('Nest', function (err, data) {
      expect(data[0].title).to.equal('Nest Package');
      done();
    });
  });
  it('should return the kyle cho package when we search for it', function (done) {
    searchPackages('Kyle', function (err, data) {
      expect(data[0].title).to.equal('Kyle Cho Package');
      done();
    });
  });
  it('should return the coffee package when we search for it', function (done) {
    searchPackages('coffee', function (err, data) {
      expect(data[0].title).to.equal('Coffee Package');
      done();
    });
  });
  it('should return the ninja package when we search for it', function (done) {
    searchPackages('ninja', function (err, data) {
      expect(data[0].title).to.equal('Ninja security package');
      done();
    });
  });
  it('should return the nest package when we search for it in description', function (done) {
    searchPackages('home control system', function (err, data) {
      expect(data[0].title).to.equal('Nest Package');
      done();
    });
  });
  it('should return the kyle cho package when we search for it in description', function (done) {
    searchPackages('korean super star', function (err, data) {
      expect(data[0].title).to.equal('Kyle Cho Package');
      done();
    });
  });

  it('should return kyle cho package when we search for it', function (done) {
    request(app)
      .post('/api/search')
      .send({
        searchTerm: 'kyle'
      })
      .expect(200)
      .end(function (err, data) {
        var json = data.body;
        expect(json).to.be.an('array');
        expect(json[0].title).to.equal('Kyle Cho Package');
        done();
      });
  });
  it('should return nest package when we search for it', function (done) {
    request(app)
      .post('/api/search')
      .send({
        searchTerm: 'nest'
      })
      .expect(200)
      .end(function (err, data) {
        var json = data.body;
        expect(json).to.be.an('array');
        expect(json[0].title).to.equal('Nest Package');
        done();
      });
  });


});
