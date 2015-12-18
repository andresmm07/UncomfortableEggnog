var natural = require('natural');
var Trie = natural.Trie;

module.exports.build = function (strings) {
  //put in core util functions
  console.log("STRINGS: ", strings);
  module.exports.trie = new Trie(false);
  module.exports.trie.addStrings(strings);
};

module.exports.findPrefix = function (str) {
  return module.exports.trie.findPrefix(str);
};
