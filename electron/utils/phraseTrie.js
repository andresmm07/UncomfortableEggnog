var _ = require('underscore');
var PhraseTrie = function (letter, command) {
  this.letter = letter || null;
  this.command = command || null;
  this.children = {};
};


PhraseTrie.prototype.findCommand = function (sentence) {
  // recurse down and return command if command
  var letters = sentence.replace(/[^0-9a-z]/gi, '').split('');
  var command = '';
  function innerFn (trie, chars) {
    if (trie.command) {
      command = trie.command;
    }
    if (trie.children[chars[0]]) {
      innerFn(trie.children[chars[0]], chars.slice(1));
    }
  }
  innerFn(this, letters);
  return command === '' ? null : command;
};

PhraseTrie.prototype.addPhrase = function (phrase, command, letters) {
  letters = letters || phrase.replace(/[^0-9a-z]/gi, '').split('');
  var letter = letters[0];
  var nextPhrase = this.hasChild(letter);

  if (!(nextPhrase instanceof PhraseTrie)) {
    var tmp = nextPhrase;
    nextPhrase = new PhraseTrie();
    nextPhrase = _.extend(nextPhrase, tmp);
  }

  if (letters.length === 0) {
    this.command = command;
    return;
  } else if (!nextPhrase) {
    nextPhrase = new PhraseTrie(letter);
    this.children[letter] = nextPhrase;
    nextPhrase.addPhrase(phrase, command, letters.slice(1));
  } else {
    nextPhrase.addPhrase(phrase, command, letters.slice(1));
  }

};

PhraseTrie.prototype.hasChild = function (letter) {
  for (var key in this.children) {
    if (key === letter) {
      return this.children[key];
    }
  }
  return null;
};


module.exports = PhraseTrie;
