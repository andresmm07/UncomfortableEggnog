var _ = require('underscore');
var fs = require('fs');

var loadPhrases = function (phrasesPath, commands) {
  var phrases = {};
  try {
    phrases = JSON.parse(fs.readFileSync(phrasesPath));
  } catch (e) {
    console.log('new file');
  }

  phrases = _.defaults(phrases, Object.keys(commands)
    .reduce(function (phrases, command) {
      phrases[command] = command;
      return phrases;
    }, {}));

  updatePhrases(phrasesPath, phrases);
  return phrases;
};

var updatePhrases = function (phrasesPath, phrases) {
  console.log('writing phrase');
  fs.writeFileSync(phrasesPath, JSON.stringify(phrases));
};

module.exports = {
  loadPhrases: loadPhrases,
  getCommands: function () {
    return JSON.parse(localStorage.getItem('Commands'));
  }
};
