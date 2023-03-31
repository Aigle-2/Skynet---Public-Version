//$ node HAL9000ErrorMessageAnalyser.js
//$ node ./tools/HAL9000/HAL9000ErrorMessageAnalyser.js
const levenshtein = require("js-levenshtein");
function HAL9000MessageErrorAnalyser(string) {
  const timeoutKey = [/(\d+)(?=\s*ms)/ms]
  const errorKeys = ["timeout", "timed out", "exceeded"];
  const actionKeys = ["select", "wait", "open", "switch"];
  const statusKeys = ["unable", "failed", "unexpected", "visible", "hidden", "found"];
  const subjectKeys = ["value", "url", "landing url", "element", "tab", "selector"];
  let timeoutResult = [];
  let errorResult = [];
  let actionResult = [];
  let statusResult = [];
  let subjectResult = [];
  const allKeysArray = [timeoutKey, errorKeys, actionKeys, statusKeys, subjectKeys];
  string = string.toLowerCase() 
  allKeysArray.forEach((element, index) => {
    element.forEach((key) => {
      if (index === 0) {
        if (stringAnalyser(string, key) != undefined) {
          timeoutResult.push(stringAnalyser(string, key));
        }
      }
      if (index === 1) {
        if (stringAnalyser(string, key) != undefined) {
          errorResult.push(stringAnalyser(string, key));
        }
      }
      if (index === 2) {
        if (stringAnalyser(string, key) != undefined) {
          actionResult.push(stringAnalyser(string, key));
        }
      }
      if (index === 3) {
        if (stringAnalyser(string, key) != undefined) {
          statusResult.push(stringAnalyser(string, key));
        }
      }
      if (index === 4) {
        if (stringAnalyser(string, key) != undefined) {
          subjectResult.push(stringAnalyser(string, key));
        }
      }
    });
  });
  if ('url' in subjectResult && 'landing url' in subjectResult) {
    const index = subjectResult.indexOf('url');
    if (index > -1) {
      subjectResult.splice(index, 1);
    }
  }
  console.log({
    timeoutResult: timeoutResult,
    errorResult: errorResult,
    actionResult: actionResult,
    statusResult: statusResult,
    subjectResult: subjectResult,
  });
  return {
    timeoutResult: timeoutResult,
    errorResult: errorResult,
    actionResult: actionResult,
    statusResult: statusResult,
    subjectResult: subjectResult,
  };
}

function stringAnalyser(string, key) {
  if (string.match(key) != null) {
    return string.match(key)[0];
  }
}

let message1 = 'Wait until element \".mealPlans .price-extra (/-/)\" visible : Error: No visible element found for selector: .mealPlans .price-extra (/-/)'
let message2 = 'Wait until element \".color--success-dark  (#1)\" visible : Error: No visible element found for selector: .color--success-dark  (#1)'
let differenceIAActuelle = Math.abs(levenshtein(message1, message2)) / Math.max(message1.length, message2.length);

console.log("\n")
console.log("differenceIAActuelle = ", differenceIAActuelle)
console.log("\n")
console.log("Run 1 error message analyser :\n")
HAL9000MessageErrorAnalyser(
  message1
);
console.log("\n")
console.log("Run 2 error message analyser :\n")
HAL9000MessageErrorAnalyser(
  message2
);
