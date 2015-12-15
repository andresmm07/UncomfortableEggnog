var _ = require('underscore');
module.exports = function (arr, term) {
  var regTerm = new RegExp(term, 'i'); // creates new regexp obj
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].match(regTerm)) {
      return true;
    }
  }
  return false;
};
