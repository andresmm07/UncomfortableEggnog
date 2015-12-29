var expect = require('chai').expect;
var commandsUtil = require('../app/commandsCTRL/commandsCTRL');
var config = require('../app/config/config');

var fs = require('fs');
var del = require('del');
var extraCommands = {
  "blah blah": "osascript -e 'tell application \"System Events\"" +
             "to repeat 2 times' -e 'key code 24 using {command down}'" +
             " -e 'delay 0.1' -e 'end repeat'",
  "dah dah": "osascript -e 'tell application \"System Events\"" +
             " to repeat 2 times' -e 'key code 27 using {command down}'" +
             " -e 'delay 0.1' -e 'end repeat'"
};

xdescribe('commands Parser', function (done) {
  before(function (done) {
    fs.readFile(config.coreCommandsJSON, 'utf8', function (err, data) {
      fs.writeFile(config.testCoreCommandsJSON, data, function (err, data) {
        commandsUtil.loadPackage(config.testCoreCommandsJSON);
        done();
      });
    });
  });
  after(function (done) {
    del([config.testCoreCommandsJSON, config.testCorePhrasesJSON])
      .then(function () {
        done();
      });
  });
  it('should get commands', function (done) {
    var commands = commandsUtil.getCommands();
    expect(commands).to.have.property('commands');
    expect(commands).to.have.property('phrasesPath');
    expect(commands.commands).to.have.property('kyle cho pro tip');
    done();
  });
  it('should add command', function (done) {
    commandsUtil.addCommand(config.testCoreCommandsJSON, extraCommands);
    var commands = commandsUtil.getCommands();
    expect(commands.commands).to.have.property("blah blah");
    expect(commands.commands).to.have.property("dah dah");
    done();
  });
  it('should delete command', function (done) {
    commandsUtil.addCommand(config.testCoreCommandsJSON, {
      "computer overlord": "I cannot do that Dave"
    });
    var commands = commandsUtil.getCommands();
    expect(commands.commands).to.have.property('computer overlord');
    commandsUtil.delCommand(config.testCoreCommandsJSON, 'computer overlord');
    commands = commandsUtil.getCommands();
    expect(commands.commands['computer overlord']).to.not.exist;
    done();
  });
  it('should update commands', function (done) {
    commandsUtil.addCommand(config.testCoreCommandsJSON, {
      "computer overlord": "I cannot do that Dave"
    });
    var commands = commandsUtil.getCommands();
    expect(commands.commands).to.have.property('computer overlord');
    commandsUtil.updateCommand(config.testCoreCommandsJSON, {
      'computer overlord': "I'm afraid I cannot do that Dave"
    });
    commands = commandsUtil.getCommands();
    expect(commands.commands['computer overlord']).to.equal("I'm afraid I cannot do that Dave");
    done();
  });
});
