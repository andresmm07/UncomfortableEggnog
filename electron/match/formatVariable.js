/**
   * formatVariable
   * ===========
   *
   * Takes an input (command) actionPrefix and variable string.
   * Looks up command in argCommands object and returns the variable
   * with the correct delimiter syntax.
   *
   *  EX: formatVariable('check the', 'name of US president') //=> 'name+of+US+president'
   *
* */

//test commands object ==> need to pass this in
// var commands = {
//   "exactCommands":
//     {
//       "kyle cho pro tip": "say kyle cho pro tip"
//     },
//   "argCommands":
//     {
//       "check the": {
//         "commands": ["open https//www.google.com/?gws_rd=ssl#q="],
//         "args": [{
//           "del": "+"
//           }]
//         },

//       "open": {
//         "commands": ["open ", ".app"],
//         "args": [{
//           "del": "\\ ",
//           "capitalize": true
//           "chain": true,
//           "chainkey": "and also"
//           }]
//         }
//     }
//   };
//===test strings====
//  phrase = "check the";
//  variable = "name of US president";
var _argSyntax = /<ARG\s*[a-zA-Z+=_'"\s\\\/]*\/>/;

module.exports = function (actionPrefix, actionObj, variable, commandsObj) {
  var bash = commandsObj.rawCommands[actionPrefix]; // open http://.....<args/>
  console.log(variable);
  var argParams = actionObj["args"];

  //=========Argument Parameter Handling=======
  //TODO: move argument parameter handling to separate module.
  // if (argParams['chain']) {

  // }

  //===string case====

  if (argParams['case'] === 'upper') {
    variable = variable.toUpperCase();
  } else if (argParams['case'] === 'lower') {
    variable = variable.toLowerCase();
  } else if (argParams['case'] === 'proper') {
    variable = variable[0].toUpperCase() + variable.slice(1);
  }

  //===wrap quotation marks====
  if (argParams['quotes']) {
    variable = '"' + variable + '"';
  }

  var varArr = variable.trim().split(' ');
  //===capitalize====
  if (argParams['capitalize']) {
    varArr = varArr.map(function (word) {
      return word[0].toUpperCase() + word.slice(1);
    });
  }

  //===delimiter====
  var del = argParams["del"];
  //add backslash to whitespace delimiters.
  if (del === " ") {
    del = "\\ ";
  }
  variable = varArr.join(argParams['del']);
  console.log('GENERATED VARIABLE: ', variable);

  var _action = bash.replace(_argSyntax, variable);
  console.log("results: ", _action);
  return _action;
};
