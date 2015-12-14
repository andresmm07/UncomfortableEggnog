var _ = require('underscore');
module.exports = function (arr, term) {
  var regTerm = new RegExp(term, 'i'); // creates new regexp obj
  return _.some(arr, function (key) {
    return key.match(regTerm); // tests key against regTerm
  });
};
