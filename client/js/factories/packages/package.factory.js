(function () {
  'use strict';

  angular.module('app')
  .factory('PackageFactory', PackageFactory);

  PackageFactory.$inject = [];

  function PackageFactory () {
    var services = {
      makeStars: makeStars,
      formatDate: formatDate
    };

    return services;
//takes package ratings and generates an array with our font-awesome classes.
    function makeStars (pkg) {
      var starClasses = [];
      var starRating = pkg.stars / pkg.countReviews;
      for (var i = 1; i <= starRating; i++) {
        starClasses.push("fa fa-star");
      }
//half star case
      if (starRating - i + 1 >= 0.5) {
        starClasses.push("fa fa-star-half-o");
      }
// fill rest of stars with empty stars.
      for (i = starRating; i < 4.5; i++) {
        starClasses.push("fa fa-star-o");
      }
      return starClasses;
    }
    function formatDate (pkg) {
      return moment(pkg.dateCreated).fromNow();
    }
  }
})();
