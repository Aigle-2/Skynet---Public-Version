//$ node ./tools/HAL9000/dataQualityQuantifierV3.js

let inputFileTrain = require("../../training/HAL9000/legacy/Edition 3/trainDataset.json");
let inputFileTest = require("../../training/HAL9000/legacy/Edition 3/testDataset.json");
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
let TrainDifferentHostArray = [];
let TrainIdenticalHostArray = [];
let TestDifferentHostArray = [];
let TestIdenticalHostArray = [];
//Identical cases
TrainIdentical.forEach((element, index) => {
  if (IdenticalErrorCondition(element)) {
    console.log("Identical Error in Training Data at index " + index + " :\n");
    console.log(element);
    console.log("\n");
    TrainIdenticalErrors = TrainIdenticalErrors + 1;
  }
  TrainIdenticalHostArray.push(
    element.failRun.failData.website.currentUrl.host
  );
});
TestIdentical.forEach((element, index) => {
  if (IdenticalErrorCondition(element)) {
    console.log("Identical Error in Testing Data at index " + index + " :\n");
    console.log(element);
    console.log("\n");
    TestIdenticalErrors = TestIdenticalErrors + 1;
  }
  TestIdenticalHostArray.push(element.failRun.failData.website.currentUrl.host);
});
//Different cases
TrainDifferent.forEach((element, index) => {
  if (DifferentErrorCondition(element)) {
    TrainDifferentErrors = TrainDifferentErrors + 1;
  }
  TrainDifferentHostArray.push(
    element.failRun.failData.website.currentUrl.host
  );
});
TestDifferent.forEach((element, index) => {
  if (DifferentErrorCondition(element)) {
    TestDifferentErrors = TestDifferentErrors + 1;
  }
  TestDifferentHostArray.push(element.failRun.failData.website.currentUrl.host);
});

TrainDifferentHostArray = ArrayOccurenceCounter(TrainDifferentHostArray);
TrainIdenticalHostArray = ArrayOccurenceCounter(TrainIdenticalHostArray);
TestDifferentHostArray = ArrayOccurenceCounter(TestDifferentHostArray);
TestIdenticalHostArray = ArrayOccurenceCounter(TestIdenticalHostArray);
console.log("\n");
console.log("TrainIdenticalHostArray - " + TrainIdentical.length + " entries in total");
console.log(TrainIdenticalHostArray);
console.log("\n");
console.log("TrainDifferentHostArray - " + TrainDifferent.length + " entries in total");
console.log(TrainDifferentHostArray);
console.log("\n");
console.log("TestIdenticalHostArray - " + TestIdentical.length + " entries in total");
console.log(TestIdenticalHostArray);
console.log("\n");
console.log("TestDifferentHostArray - " + TestDifferent.length + " entries in total");
console.log(TestDifferentHostArray);
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
      entry.failRun.failData.website.currentUrl.protocol,
      entry.comparedRun.failData.website.currentUrl.protocol
    ) ||
    !_.isEqual(
      entry.failRun.failData.website.currentUrl.host,
      entry.comparedRun.failData.website.currentUrl.host
    ) ||
    !_.isEqual(
      entry.failRun.failData.website.currentStatus,
      entry.comparedRun.failData.website.currentStatus
    ) ||
    (!_.isEqual(entry.failRun.stepCount, entry.comparedRun.stepCount) &&
      !_.isEqual(entry.failRun.message, entry.comparedRun.message) &&
      (!_.isEqual(
        entry.failRun.failData.step.priority,
        entry.comparedRun.failData.step.priority
      ) ||
        !_.isEqual(
          entry.failRun.failData.step.label,
          entry.comparedRun.failData.step.label
        ) ||
        !_.isEqual(
          entry.failRun.failData.step.category,
          entry.comparedRun.failData.category
        )) &&
      !_.isEqual(
        entry.failRun.failData.block,
        entry.comparedRun.failData.block
      ) &&
      !_.isEqual(
        entry.failRun.failData.error,
        entry.comparedRun.failData.error
      ))
  );
}

function DifferentErrorCondition(entry) {
  return _.isEqual(entry.failRun, entry.comparedRun);
}

function ArrayOccurenceCounter(array) { 
    return (Object.entries(_.countBy(array))).sort((a, b) => - a[1] + b[1]);
}
