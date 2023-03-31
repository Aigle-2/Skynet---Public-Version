//$ node dataQualityQuantifierV4.js

let inputFileTrain = require("../../training/HAL9000/trainDataset.json");
let inputFileTest = require("../../training/HAL9000/testDataset.json");
var _ = require("lodash");
// let fs = require("fs")
const util = require("util");

let TrainDifferent = inputFileTrain.different;
let TrainIdentical = inputFileTrain.identical;
let TestDifferent = inputFileTest.different;
let TestIdentical = inputFileTest.identical;
let TrainDifferentErrors = 0;
let TrainIdenticalErrors = 0;
let TestDifferentErrors = 0;
let TestIdenticalErrors = 0;

//Identical cases
TrainIdentical.forEach((element, index) => {
  if (IdenticalErrorCondition(element)) {
    console.log("Identical Error in Training Data at index "+ index +" :\n")
    console.log(element)
    console.log("\n")
    TrainIdenticalErrors = TrainIdenticalErrors + 1;
  }
});
TestIdentical.forEach((element, index) => {
  if (IdenticalErrorCondition(element)) {
    console.log("Identical Error in Testing Data at index "+ index +" :\n")
    console.log(element)
    console.log("\n")
    TestIdenticalErrors = TestIdenticalErrors + 1;
  }
});
//Different cases
TrainDifferent.forEach((element, index) => {
  if (DifferentErrorCondition(element)) {
    TrainDifferentErrors = TrainDifferentErrors + 1;
  }
});
TestDifferent.forEach((element, index) => {
  if (DifferentErrorCondition(element)) {
    TestDifferentErrors = TestDifferentErrors + 1;
  }
});

console.log("\n");
console.log(
  "TRAIN DATASETS - IDENTICAL CASES - At least " +
    TrainIdenticalErrors +
    " wrong entries out of " +
    TrainIdentical.length +
    " entries, which corresponds to " +
    ((TrainIdenticalErrors * 100) / TrainIdentical.length).toFixed(2) +
    " % of errors"
);
console.log(
  "TRAIN DATASETS - DIFFERENT CASES - At least " +
    TrainDifferentErrors +
    " wrong entries out of " +
    TrainDifferent.length +
    " entries, which corresponds to " +
    ((TrainDifferentErrors * 100) / TrainDifferent.length).toFixed(2) +
    " % of errors"
);
console.log(
  "TEST DATASETS - IDENTICAL CASES - At least " +
    TestIdenticalErrors +
    " wrong entries out of " +
    TestIdentical.length +
    " entries, which corresponds to " +
    ((TestIdenticalErrors * 100) / TestIdentical.length).toFixed(2) +
    " % of errors"
);
console.log(
  "TEST DATASETS - DIFFERENT CASES - At least " +
    TestDifferentErrors +
    " wrong entries out of " +
    TestDifferent.length +
    " entries, which corresponds to " +
    ((TestDifferentErrors * 100) / TestDifferent.length).toFixed(2) +
    " % of errors"
);
function IdenticalErrorCondition(entry) {
  return (
    !_.isEqual(
      entry.failRun.website.currentUrl.protocol,
      entry.comparedRun.website.currentUrl.protocol
    ) ||
    !_.isEqual(
      entry.failRun.website.currentUrl.host,
      entry.comparedRun.website.currentUrl.host
    ) ||
    !_.isEqual(
      entry.failRun.website.currentStatus,
      entry.comparedRun.website.currentStatus
    )
  );
}

function DifferentErrorCondition(entry) {
  return _.isEqual(entry.failRun, entry.comparedRun);
}
