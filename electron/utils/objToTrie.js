var PhraseTrie = require('./phraseTrie');
var _ = require('underscore');


module.exports = function (phrases) {
  var phraseTrie = new PhraseTrie();
  phraseTrie = _.extend(phraseTrie, phrases);
  return phraseTrie;
};
