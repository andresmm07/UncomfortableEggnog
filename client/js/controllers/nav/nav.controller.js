(function () {
  'use strict';
  angular.module('app')
    .controller('NavCtrl', NavCtrl);

  NavCtrl.$inject = ["ApiFactory", "$scope", "$state"];

  function NavCtrl (ApiFactory, $scope, $state) {
    var self = $scope;
    var get = ApiFactory.get;
    var post = ApiFactory.post;
    self.search = function (term) {
      $state.go('search', {
        searchTerm: term
      });
    };
    // Logout
    self.destroySession = function () {
      console.log('destroy');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      get('/logout').then(function (result) {
        console.log('logged out');
      });
    };
    // pulls token out of localStorage and checks to see if it exists
    self.isLoggedIn = function () {
      return localStorage.getItem('token') !== null;
    };
    // returns username
    self.getUserName = function () {
      return localStorage.getItem('username');
    };
    // redirects user to their packages page
    self.goToAccount = function () {
      $state.go('user', {userName: self.getUserName()});
    };

  }
})();
