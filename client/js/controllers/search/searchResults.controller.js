(function () {
  'use strict';
  angular.module('app')
    .controller('SearchResultsCtrl', SearchResultsCtrl);

  SearchResultsCtrl.$inject = ['$state', 'ApiFactory'];

  function SearchResultsCtrl ($state, ApiFactory) {
    var self = this;
    var post = ApiFactory.post;
    self.term = $state.params.searchTerm;
    self.results = [];

    post('/api/search', $state.params).then(function (data) {
      self.results = data;
    });

    post();
  }
})();
