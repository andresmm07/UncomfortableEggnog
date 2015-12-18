var expect = require('chai').expect;
var PhraseTrie = require('../utils/phraseTrie');
var _ = require('underscore');
var coreUtils = require('../packages/core-utils');
var coreUtils = _.extend(coreUtils, {
  "apple": "aple",
  "apples": "apels",
  "apps": "apppppp",
  "apd": "sad"
});



describe('Phrase trie', function (done) {
  var phraseTrie;
  before(function (done) {
    phraseTrie = new PhraseTrie();
    for (var command in coreUtils) {
      phraseTrie.addPhrase(command, coreUtils[command]);
    }
    done();
  });
  it('should fetch known commands', function (done) {
    var command = phraseTrie.findCommand('apple');
    expect(command).to.equal('aple');
    done();
  });
  it('should add phrases', function (done) {
    var closeMatches = ['kyk pro dfsa sdaf', 'koko padsfrodfas ol'];
    var command = 'kyle cho pro tip';
    for (var i = 0; i < closeMatches.length; i++) {
      phraseTrie.addPhrase(closeMatches[i], command);
    }
    console.log(JSON.stringify(phraseTrie, null, 2));
    var result = phraseTrie.findCommand('koko padsfrodfas ol');
    expect(result).to.equal('kyle cho pro tip');
    done();
  });
  it('should find phrases that have multiple commands on its phrasesPath', function (done) {
    phraseTrie.addPhrase('applette', 'not apple');
    var result = phraseTrie.findCommand('applette');
    expect(result).to.equal('not apple');
    done();
  });
});
