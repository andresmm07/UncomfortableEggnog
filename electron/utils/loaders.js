var _ = require('underscore');
var fs = require('fs');
var PhraseTrie = require('./phraseTrie');

var loadPhrases = function (phrasesPath, commands) {
  var trie = new PhraseTrie();
  try {
    var phrases = JSON.parse(fs.readFileSync(phrasesPath));
    trie = _.extend(trie, phrases);
  } catch (e) {
    console.log('new file');
  }
  for (var command in commands) {
    //console.log('inserting, ', command);
    trie.addPhrase(command, command);
  }
  updatePhrases(phrasesPath, trie);
  return trie;
};

var updatePhrases = function (phrasesPath, phrases) {
  //console.log('writing phrase');
  fs.writeFileSync(phrasesPath, JSON.stringify(phrases, null, 2));
};

module.exports = {
  loadPhrases: loadPhrases
};
