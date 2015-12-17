(function () {
  'use strict';
  angular.module('app')
    .controller('LandingPageCtrl', LandingPageCtrl);

  LandingPageCtrl.$inject = ['ApiFactory', 'PackageFactory'];

  function LandingPageCtrl (ApiFactory, PackageFactory) {
    var self = this;
    var get = ApiFactory.get;
    var post = ApiFactory.post;
    self.packages = [];
    get('/api/top10').then(function (data) {
      self.packages = data;
      console.log(self.packages);
      calculateAvg();
      getUserData();
    });
    self.makeStars = PackageFactory.makeStars;
    self.formatDate = PackageFactory.formatDate;

  function calculateAvg () {
    var avg;
    for (var i = 0; i < self.packages.length; i++) {
      avg = parseInt(self.packages[i].stars / self.packages[i].countReviews * 20);
      self.packages[i].average = avg || 0;
    }
  }

  function getUserData () {
    get('/api/userData').then(function (user) {
      if (user.username !== undefined) {
        console.log(user);
        var token;
        if (user.username.facebook !== undefined) {
          token = user.username.facebook.token;
          localStorage.setItem('username', user.username.username);
          localStorage.setItem('token', token);
        } else if (user.username.google !== undefined) {
          token = user.username.google.token;
          localStorage.setItem('username', user.username.username);
          localStorage.setItem('token', token);
        } else if (user.username.github !== undefined) {
          token = user.username.github.id;
          localStorage.setItem('username', user.username.username);
          localStorage.setItem('token', token);
        }

      }
    });
  }

  }


})();
