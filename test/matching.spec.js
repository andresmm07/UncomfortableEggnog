var fs = require('fs');
var expect = require('chai').expect;
var matching = require('../app/matchCTRL/matchingUtil');
var testPhrases = require('../app/matchCTRL/testers/testPhrases');
var JWDTest = require('../app/matchCTRL/testers/JWDTest');
var phoneticsTest = require('../app/matchCTRL/testers/phoneticsTest');
var getMatchByScore = require('../app/matchCTRL/testers/getMatchByScore');

var commandsObj = {};
commandsObj.rawCommands = require('./tmp/commands');
commandsObj.parsedCommands = require('../app/matchCTRL/parseCommands').parseCommands(commandsObj.rawCommands);
var phrases = require('./tmp/phrases-tmp');
commandsObj.phrases = phrases;

var testCases = require('./tmp/matching-test-cases');


describe('Matching', function (done) {
  it('should match exact commands', function (done) {
    var obj = matching('google', 'hello', commandsObj);
    expect(obj).to.be.an('object');
    done();
  });
  it('should match added phrases', function (done) {
    phrases['kyle cho pro tip'].push('Kyles cho pros tips');
    var addedPhrase = testPhrases(phrases, 'Kyles cho pros tips');
    expect(addedPhrase).to.equal('kyle cho pro tip');
    done();
  });
  it('should match phonetics', function (done) {
    for (var phrase in testCases) {
      for (var i = 0; i < testCases[phrase].length; i++) {
        console.log('\n\n');
        var userInput = testCases[phrase][i].term;
        if (testCases[phrase][i].score > 0.4) {
          var guess = getMatchByScore(Object.keys(testCases), userInput);
          console.log('\n\n');
          console.log('WebSpeechAPI score: ', testCases[phrase][i].score);
          console.log("should match: ", phrase);
          console.log('guessing: ', guess);
          expect(guess).to.equal(phrase);
        }
      }
    }
    done();
  });
});
