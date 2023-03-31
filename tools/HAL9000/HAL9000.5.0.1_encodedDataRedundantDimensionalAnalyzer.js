//node HAL9000.5.0.1_encodedDataRedundantDimensionalAnalyzer.js

const obj = require("../../training/HAL9000/encodedTrainDataset.json");
let identicalResults = Array(obj.arrayInputs[0].length).fill(0);
let differentResults = Array(obj.arrayInputs[0].length).fill(0);
console.log("Size Train Dataset : ", obj.arrayInputs.length)
for (let i = 0; i < obj.arrayInputs.length; i++) {
    for (let j = 0; j < obj.arrayInputs[i].length; j++) {
        if (obj.arrayInputs[i][j] != 0) {
            // console.log(obj.arrayOutputs[i])
            if (obj.arrayOutputs[i][0] === 0) { //different
                differentResults[j] += 1
            } else {
                identicalResults[j] += 1
            }
        }
    }
}

console.log("Different Results : ", differentResults)
console.log("Identical Results : ", identicalResults)

let differenceArray = Array(obj.arrayInputs[0].length).fill(0);
for (let i = 0; i < obj.arrayInputs[0].length; i++) {
    differenceArray[i] = (i).toString()+" : "+((differentResults[i] - identicalResults[i])*100/154).toFixed(2).toString() + "%";
}

console.log("Difference Results : ", differenceArray)

const dimensionlist = [
    "0: timeoutInput",
    "1: errorResultInput",
    "2: actionResult",
    "3: statusResult",
    "4: subjectResult",
    "5: setCountInput",
    "6: failDataErrorInput",
    "7: failDataStepLabelInput",
    "8: failDataStepNumberInput",
    "9: failDataStepCategoryInput",
    "10: failDataStepPriorityInput",
    "11: failDataBlockTypeInput",
    "12: failDataBlockCodeInput",
    "13: failDataBlockParametersTargetUrlInput",
    "14: failDataBlockParametersVisibilityInput",
    "15: failDataBlockParametersTestContentInput",
    "16: failDataBlockParametersExpectedTextInput",
    "17: failDataSelectorsInput",
    "18: failDataWebsiteCurrentUrlProtocolInput",
    "19: failDataWebsiteCurrentUrlHostInput",
    "20: failDataWebsiteCurrentUrlPathInput",
    "21: failDataWebsiteCurrentUrlSearchInput",
    "22: failDataWebsiteCurrentUrlHashInput",
    "23: faildataWebsiteCurrentStatusInput",
    "24: failDataDuration",
    "25: failDataTerminal",
    "26: failDataEngine",
    "27: failDataIsMobile",
    "28: failDataScreenshotDifference", 
    "29: failDataViewportDifference", 
    "30: failDataScenarioId",
    "31: failDataCustomerId",
    "32: failDataRevisionId",
    "33: failDataGeolocalisation",
    "34: failDataTerminalType",
    "35: failDataUseRandom",
  ];
console.log(dimensionlist)