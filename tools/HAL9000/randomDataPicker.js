// node randomDataPicker.js
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node-gpu');
var moment = require("moment-timezone");
const moduleInstance = require("../../lib/Modules/HAL9000"); //HAL9000
const skynet = require("../../lib/Framework/Skynet")(
  moduleInstance,
  tf
);
// console.log("Init finished")
(async () => {
    skynet.initialize(2);
    await skynet.generateData(false);
    const filenameTraining = "Encoded_training_data_" + (moment().tz("Europe/Paris").format("YYYYMMDD-HHmmss")) + ".json";
    const string = skynet.saveEncoding(skynet.trainingData, "training",true,moduleInstance)
    fs.writeFileSync("E:/Projets/Skynet/misc/HAL9000/"+filenameTraining, string);
    console.log("END")
})();


// let obj = new Object()
// obj.rawExamples = []
// obj.encodedExamples = []
// obj.rawExamplesAnswers = []
// obj.encodedAnswers = []

// const jsonString = JSON.stringify(obj)

// function shuffleData(array1, array2) {
//     let newArray1 = [];
//     let newArray2 = [];
//     let arrayLength = array1.length;
//     let index;
//     for (let i = 0; i < arrayLength; i++) {
//         index = Math.trunc(Math.random() * array1.length);
//         //console.log(index);
//         newArray1.push(array1[index]);
//         newArray2.push(array2[index]);
//         array1.splice(index, 1);
//         array2.splice(index, 1);
//     }
//     return {
//         array1: newArray1,
//         array2: newArray2,
//     };
// }