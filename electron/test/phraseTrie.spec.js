var expect = require('chai').expect;
var PhraseTrie = require('../utils/phraseTrie').PhraseTrie;
var fs = require('fs');
var _ = require('underscore');
// var coreUtils = JSON.parse(fs.readFileSync(__dirname + '/../packages/newcommands.json'));
var coreUtils = require('../packages/core-utils');
coreUtils = _.extend(coreUtils, {
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
      phraseTrie.addPhrase(command, command);
    }
    console.log(JSON.stringify(phraseTrie, null, 2));
    done();
  });
  it('should fetch known commands', function (done) {
    for (var command in coreUtils) {
      var result = phraseTrie.findCommand(command);
      expect(result).to.equal(command);
    }
    done();
  });
  it('should add phrases', function (done) {
    var closeMatches = ['kykprodfsasdaf', 'koko padsfrodfas ol'];
    var command = 'kyle cho pro tip';
    for (var i = 0; i < closeMatches.length; i++) {
      phraseTrie.addPhrase(closeMatches[i], command);
    }
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
  it('should rebuilt from empty object', function (done) {
    // var objFromString = JSON.parse(JSON.stringify(phraseTrie));
    fs.writeFileSync(__dirname + "/tmp/test.json", JSON.stringify(phraseTrie));
    var objFromString = JSON.parse(fs.readFileSync(__dirname + '/tmp/test.json'));
    expect(objFromString instanceof PhraseTrie).to.equal(false);

    var result = phraseTrie instanceof PhraseTrie;
    console.log('phraseTrie is a PhraseTrie ', result);
    expect(result).to.equal(true);

    var testTrie = new PhraseTrie();
    result = testTrie instanceof PhraseTrie;
    console.log('testTrie is a PhraseTrie ', result);
    expect(result).to.equal(true);

    testTrie = _.extend(testTrie, objFromString);
    result = testTrie instanceof PhraseTrie;
    console.log('testTrie is a PhraseTrie ', result);
    expect(result).to.equal(true);


    testTrie.addPhrase('billy', 'blue');
    var phrase = testTrie.findCommand('billy');
    expect(phrase).to.equal('blue');

    done();
  });
  it('should let you change commands already put in there', function (done) {
    phraseTrie.addPhrase('bob', 'billy');
    phraseTrie.addPhrase('bob', 'tang');
    var result = phraseTrie.findCommand('bob');
    expect(result).to.equal('tang');
    done();
  });
});
