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

//test actionObj ==> need to pass this in
// var actionObj =
//   {
//     "commands": ["open ", ".app"],
//     "args": [{
//       "del": "\\ ",
//       "capitalize": true,
//       "chain": true,
//       "chainkey": "and also"
//       }]
//   };

// var commandsObj =
//   {
//     "rawCommands": {
//       "open": "open /Applications/<ARG del='\\ ' capitalize=true chain=true chainkey='and also'/>.app"
//     }

//   };

// var actionObj =
//   {
//     "commands": ["open ", ".app"],
//     "args": [{
//       "del": "\\ ",
//       "capitalize": true,
//       "chain": true,
//       "chainkey": "and also"
//       }]
//   };

// var commandsObj =
//   {
//     "rawCommands": {
//       "open": "open /Applications/<ARG del='\\ ' capitalize=true chain=true chainkey='and also'/>.app"
//     }

//   };










//===test strings====
//  phrase = "check the";
//  variable = "name of US president";
var _argSyntax = /<ARG\s*[a-zA-Z+=_'"\s\\\/]*\/>/;

function buildArgumentSyntax (argStr, argParams) {

  //===string case====
  if (argParams['case'] === 'upper') {
    argStr = argStr.toUpperCase();
  } else if (argParams['case'] === 'lower') {
    argStr = argStr.toLowerCase();
  } else if (argParams['case'] === 'proper') {
    argStr = argStr[0].toUpperCase() + argStr.slice(1);
  }

  //===wrap quotation marks====
  if (argParams['quotes']) {
    argStr = '"' + argStr + '"';
  }

  var varArr = argStr.trim().split(' ');
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

  argStr = varArr.join(argParams['del']);
  console.log('GENERATED VARIABLE: ', argStr);
  return argStr;
}


module.exports = function (actionPrefix, actionObj, variable, commandsObj) {
  var bash = commandsObj.rawCommands[actionPrefix]; // open http://.....<args/>


  var bashStrs = actionObj["commands"];
  var args = actionObj["args"];

  var argParams = actionObj["args"][0];

  // for (var i = 0; i < args.length; i++) {
  //   args[i];
  // var argParams = args[i];
  //=========Argument Parameter Handling=======
  //TODO: move argument parameter handling to separate module.


  //===chain case: process this first for potential extra arguments.
  if (argParams['chain']) {
    var varArr = variable.split(argParams['chainkey']);
  } else {

  }

    var _action = '';
    for (var i = 0; i < varArr.length; i++) {
      var variable = buildArgumentSyntax(varArr[i], argParams);
      _action += bash.replace(_argSyntax, variable) + ';';
    }
    console.log(_action);
    return _action;
  // } else {


  };



  // var _action = bash.replace(_argSyntax, variable);
//   console.log("results: ", _action);
//   }
//   return _action;
// // };
