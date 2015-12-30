var regMatch = require('../regMatch');
module.exports = function (phrases, _actionPrefix) {
  // console.log('testing phrases', phrases);
  for (var phrase in phrases) {
    console.log(phrases[phrase]);
    if (regMatch(phrases[phrase], _actionPrefix)) {
      return phrase;
    };
  }
  return null;
};
