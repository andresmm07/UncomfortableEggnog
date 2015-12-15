var fs = require('fs');
var expect = require('chai').expect;
var matchUtil = require('../match/matching');

var matching = matchUtil.matching;
var testPhrases = matchUtil.testPhrases;
var JWDTest = matchUtil.JWDTest;
var phoneticsTest = matchUtil.phoneticsTest;

var commandsObj = {};
commandsObj.rawCommands = require('./tmp/commands');
commandsObj.parsedCommands = require('../match/parseCommands').parseCommands(commandsObj.rawCommands);
var phrases = require('./tmp/phrases-tmp');
commandsObj.phrases = phrases;



describe('Matching', function (done) {
  it('should match exact commands', function (done) {
    var obj = matching('google', 'hello', commandsObj);
    expect(obj).to.be.an('object');
    done();
  });
  it('should match added phrases', function (done) {
    var obj = matching("kyoto protocol", null, commandsObj);
    expect(obj.action).to.not.equal(undefined);
    expect(obj.action).to.equal("say kyle cho pro tip");
    done();
  });
  it('should match phonetics', function (done) {
    for (var phrase in phrases) {
      var matches = phrases[phrase];
      for (var i = 0; i < matches.length; i++) {
        console.log('\n\n\n');
        console.log("testing " + matches[i] + ' with ' + phrase);
        console.log("phoneticsTest  " + phoneticsTest(matches[i], phrase));
        console.log("JWDTest   " + JWDTest(matches[i], phrase));

      }
    }
    done();
  });
});
