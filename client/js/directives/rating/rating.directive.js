(function () {
  'use strict';
  angular.module('app')
    .directive('rating', RatingDirective);

  function RatingDirective (ApiFactory) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'js/html/rating/rating.main.html',
      link: link,
      scope: {
        score: '@score',
        max: '@max',
        review: '=review',
        packageEntry: '=package'
      }
    };

    var post = ApiFactory.post;

    return directive;

    function link(scope, elem, attrs) {
      scope.$watch('packageEntry', function (newValue, oldValue) {
        if (newValue) {
          console.log("new value", newValue);
        }
      }, true);

      scope.updateStars = function () {
        var index = 0;
        scope.stars = [];
        for (index = 0; index < scope.max; index++) {
          scope.stars.push({
            full: scope.score > index
          });
        }
      };
      scope.starClass = function (star, index) {
        var starClass = 'fa-star-o';
        if (star.full) {
          starClass = 'fa-star';
        }

        return starClass;
      };

      scope.$watch('score', function (newValue, oldValue) {
        if (newValue !== null && newValue !== undefined) {
          scope.updateStars();
        }
      });

      scope.setRating = function (index) {
        scope.score = index + 1;
      };

      scope.submitReview = function () {
        var id = scope.packageEntry._id;
        post('/api/package/' + id, {
          stars: scope.score,
          review: scope.review
        })
          .then(function (res) {
            scope.review = "";
          });
      };

      scope.hover = function (index) {
        scope.hoverIndex = index;
      };

      scope.stopHover = function () {
        scope.hoverIndex = -1;
      };

      scope.starColor = function (index) {
        console.log(index);
        var starClass = 'rating-normal';
        if (star.full || index <= scope.hoverIndex) {
         starClass = 'rating-highlight';
        }
        return starClass;
      };
    }
  }
})();