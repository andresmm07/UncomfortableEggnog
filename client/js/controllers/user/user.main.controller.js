(function () {
  'use strict';
  angular.module('app')
    .controller('UserMainCtrl', UserMainCtrl);

  UserMainCtrl.$inject = ['ApiFactory', '$state'];

  function UserMainCtrl (ApiFactory, $state) {
    var self = this;

    self.fields = {
      username: $state.params.userName,
      fullname : '',
      email: '',
      website: '',
      packages: [],
      userLink: window.location.href,
      numPackages: 0,
      canEditProfile: false,
      canEditPackages: false
      };

    self.countPackages = function (count) {
        if (count === 1) {
          return "1 package by " + self.fields.username;
        }
        if (count !== 1) {
          return count + " packages by " + self.fields.username;
        }
    };

    ApiFactory.get('/user/' + self.fields.username)
      .then(function (user) {
        console.log(window.location.hash);
        if (!user || (window.location.hash === "#/user/")) {
           $state.go('main');
        }
          self.fields.email = user.email;
          self.fields.website = user.website;

          if (user["first name"]) {
            self.fields.fullname = user["first name"];
          }
          if (user["last name"]) {
            self.fields.fullname += ' ' + user["last name"];
          }
          if ((window.location.hash === ('#/user/' + localStorage.username)) && (!user.github) && (!user.facebook) && (!user.google)) {
            self.fields.canEditProfile = true;
          }
          var formatedUsername = encodeURIComponent(localStorage.username.trim());
          if (window.location.hash === ('#/user/' + formatedUsername)) {
            self.fields.canEditPackages = true;
          }
      });

    ApiFactory.get('/api/users/' + self.fields.username + '/packages')
      .then(function (data) {
        if (!data) {
           $state.go('main');
        }
        self.fields.packages = data;
        self.fields.numPackages = self.countPackages(data.length);
      });
  }
})();


