(function () {
  'use strict';
  angular.module('app')
    .factory('ApiFactory', ApiFactory);
  ApiFactory.$inject = ['$http'];


  function ApiFactory ($http) {
    var services = {
      get : get,
      post: post
    };
    return services;

  function parse (results) {
    return results.data;
  }

  function errorHandler (results) {
    console.log("error :", results);
    return results.data;
  }

    function checkToken () {
      // checks to see if we have a token, if we do, we set $http to have header
      // token and set it to our jwt
      if (localStorage.getItem('token')) {
        $http.defaults.headers.common.token = localStorage.getItem('token');
      }
    }

    /**
     * Makes a get request
     *
     * @param {string} url -  url of endpoint
     * @return {object}
     */

    function get (url) {
      checkToken();
      return $http({
        method: 'GET',
        url: url
      }).then(parse, errorHandler);
    }

    /**
     * Makes a post request
     *
     * @param {string} url - url end point
     * @param {object} data - data to be sent to end point
     * @return {object}
     */

    function post (url, data) {
      checkToken();
      return $http({
        method: 'POST',
        url: url,
        data: data
      }).then(parse).catch(errorHandler);
    }
  }

})();
