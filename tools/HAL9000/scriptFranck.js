console.log("[IA START SCRIPT]");
var _ = require("lodash");

function compareObjects(objA, objB) {
  let comparison = {};
  const keys = _.uniq(Object.keys(objA).concat(Object.keys(objB)));
  console.log("compareObjects", keys);
  keys.forEach((key) => {
    if (typeof objA[key] != "undefined" && typeof objB[key] == "undefined") {
      if (typeof objA[key] == "object" && objA[key] !== null)
        comparison[key] = compareObjects(objA[key], {});
      else comparison[key] = false;
    } else if (
      typeof objB[key] != "undefined" &&
      typeof objA[key] == "undefined"
    ) {
      if (typeof objB[key] == "object" && objB[key] !== null)
        comparison[key] = compareObjects(objB[key], {});
      else comparison[key] = false;
    } else {
      if (
        typeof objA[key] == "object" &&
        objA[key] !== null &&
        typeof objA[key] == "object" &&
        objA[key] !== null
      ) {
        comparison[key] = compareObjects(objA[key], objB[key]);
      } else {
        const identical = objA[key] == objB[key];
        comparison[key] = identical;
      }
    }
  });
  return comparison;
}

console.log(compareObjects(objA, objB));
console.log("[IA END SCRIPT]");
