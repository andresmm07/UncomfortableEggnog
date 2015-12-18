var PhraseTrie = function (letter, command) {
  this.letter = letter || null;
  this.command = command || null;
  this.children = {};
};


PhraseTrie.prototype.findCommand = function (sentence) {
  // recurse down and return command if command
  var letters = sentence.replace(/[\s]/g, '').split('');
  var command = '';
  function innerFn (trie, chars) {
    if (trie.command) {
      command = trie.command;
      console.log(command);
    }
    if (trie.children[chars[0]]) {
      innerFn(trie.children[chars[0]], chars.slice(1));
    }
  }
  innerFn(this, letters);
  return command === '' ? null : command;
};
//
// PhraseTrie.prototype.findCommand = function (sentence, letters, command) {
//   // recurse down and return command if command
//   letters = letters || sentence.replace(/[\s]/g).split('');
//   command = command || null;
//
//   if (this.command) {
//     command = this.command;
//   }
//   if (!letters.length) {
//     return command
//   }
//   if (this.children[letters[0]]) {
//     return this.children[letters[0]]
//                .findCommand(
//                  sentence,
//                  letters.slice(1),
//                  command
//                );
//   }
//
//   return command;
// };

PhraseTrie.prototype.addPhrase = function (phrase, command, letters) {
  letters = letters || phrase.replace(/[\s]/g, '').split('');
  var letter = letters[0];
  var nextPhrase = this.hasChild(letter);
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
