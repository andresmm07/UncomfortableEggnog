var _ = require('underscore');

function PhraseTrie (letter, command) {
  this.letter = letter || null;
  this.command = command || null;
  this.children = {};
};


PhraseTrie.prototype.findCommand = function (sentence) {
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
  console.log('adding', phrase);
  letters = letters || phrase.replace(/[^0-9a-z]/gi, '').split('');
  var letter = letters[0];
  var nextPhrase = this.hasChild(letter);

  if (!(nextPhrase instanceof PhraseTrie) && nextPhrase !== null) {
    nextPhrase = module.exports.objToTrie(nextPhrase);
    console.log(nextPhrase instanceof PhraseTrie);
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

module.exports.objToTrie = function (phrases) {
  var phraseTrie = new PhraseTrie();
  phraseTrie = _.extend(phraseTrie, phrases);
  return phraseTrie;
};

module.exports.PhraseTrie = PhraseTrie;
