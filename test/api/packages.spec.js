var request = require('supertest');
var expect = require('chai').expect;
var app = require('../../server/app');
var db = require('../../server/db/db');
var helpers = require('../../server/helpers/helpers');
var _ = require('underscore');
var async = require('async');

var packages = _.range(30).map(function (x) {
  return {
    title: x + ' Dev Package',
    description: 'all the commands you ever need',
    packageContents: JSON.stringify({
      'git push': 'git push origin master',
      'make folder apple': 'mkdir apple'
    })
  };
});

describe('Should talk to the db', function (done) {

  beforeEach(function (done) {
    db.User.create({
      username: 'Fred',
      password: '1234'
    }, function (err, user) {
      async.map(packages, function (packageE, cb) {
        helpers.savePackage(user.username, packageE, cb);
      }, function (err, data) {
        done();
      });
    });
  });

  afterEach(function (done) {
    db.User.remove({}, function (err) {
      db.PackageEntry.remove({}, function (err) {
        done();
      });
    });
  });

  it('should add create a package and we should be able to find it', function (done) {
    helpers.savePackage('Fred', {
      title: 'Kyle Cho Package',
      description: 'kyle cho\'s personal commands',
      packageContents: JSON.stringify({
        'git push': 'git push origin master',
        'make folder apple': 'mkdir apple'
      })
    }, function (err, data) {
      request(app)
        .post('/api/search')
        .send({searchTerm: 'Cho'})
        .expect(200, function (err, data) {
          var json = data.body;
          expect(json.length).to.equal(1);
          expect(json[0].title).to.equal('Kyle Cho Package');
          done();
        });
    });
  });
  it('should retrieve the top10 packages in the db', function (done) {
    request(app)
      .get('/api/top10')
      .expect(200)
      .end(function (err, json) {
        json = json.body;
        expect(json).to.be.an('array');
        expect(json.length).to.equal(10);
        expect(json[0]).to.have.property('downloads');
        expect(json[0]).to.have.property('likes');
        expect(json[0]).to.have.property('dislikes');
        expect(json[0]).to.have.property('dateCreated');
        done();
      });
  });
  it('should return search results for search', function (done) {
    request(app)
      .post('/api/search')
      .send({
        searchTerm: '10'
      })
      .expect(200)
      .end(function (err, json) {
        json = json.body;
        expect(json).to.be.an('array');
        expect(json[0].title).to.equal('10 Dev Package');
        done();
      });
  });
  it('should return all packages from user', function (done) {
    request(app)
      .get('/api/users/Fred/packages')
      .expect(200)
      .end(function (err, data) {
        var json = data.body;
        expect(json).to.be.an('array');
        expect(json.length).to.equal(30);
        done();
      });
  });
  it('should let you edit packages', function (done) {
    var packageEdit = packages[10];
    packageEdit.title = "KyleChoAwesome";
    request(app)
      .post('/api/package/10 Dev Package/edit')
      .send(packageEdit)
      .expect(201)
      .end(function (err, data) {
        request(app)
          .get('/api/package/KyleChoAwesome')
          .expect(200)
          .end(function (err, data) {
            var json = data.body;
            expect(json.title).to.equal(packageEdit.title);
            done();
          });
      });
  });

});
