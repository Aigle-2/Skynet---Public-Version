//$ node dataFormatterV3V4.js
// let dataType = "test" //train
let dataType = "train" 
let inputFile = require("../../training/HAL9000/legacy/Edition 3/" + dataType + "Dataset.json");
let string;
let differentArray = [];
let identicalArray = [];
let fs = require("fs")
const util = require("util")


let inputFileDifferent = inputFile.different
let inputFileIdentical = inputFile.identical
let updatedformatidentical;
let updatedformatdifferent;
inputFileDifferent.forEach((element, index) => {
    updatedformatdifferent = undefined
    if (element.failRun.failData == undefined) {
        console.log(element)
    }
    updatedformatdifferent = {
        "failRun": {
            "step": {
                "code": element.failRun.stepCount,
                "label": element.failRun.failData.step !== undefined && element.failRun.failData.step.label != undefined ? element.failRun.failData.step.label : '',
                "number": element.failRun.failData.step.number,
                "category": element.failRun.failData.step.category,
                "priority": element.failRun.failData.step.priority,
            },
            "message": element.failRun.failData.message,
            "error": element.failRun.failData.error,
            "block": {
                "type": element.failRun.failData.block.type,
                "code": element.failRun.failData.block.code,
                "parameters": {
                    "targetUrl": element.failRun.failData.block.parameters.targetUrl,
                    "visibility": element.failRun.failData.block.parameters.visibility,
                    "textContent": typeof(element.failRun.failData.block.parameters.textContent) == "number" ? element.failRun.failData.block.parameters.textContent.toString() : element.failRun.failData.block.parameters.textContent,
                    "expectedText": element.failRun.failData.block.parameters.expectedText,
                }
            },
            "website": {
                "currentUrl": {
                    "protocol": element.failRun.failData.website.currentUrl.protocol,
                    "host": element.failRun.failData.website.currentUrl.host,
                    "path": element.failRun.failData.website.currentUrl.path,
                    "search": element.failRun.failData.website.currentUrl.search,
                    "hash": element.failRun.failData.website.currentUrl.hash
                },
                "currentStatus": element.failRun.failData.website.currentStatus
            }
        },
        "comparedRun": {
            "step": {
                "code": element.comparedRun.stepCount,
                "label": element.comparedRun.failData.step !== undefined && element.comparedRun.failData.step.label != undefined ? element.comparedRun.failData.step.label : '',
                "number": element.comparedRun.failData.step.number,
                "category": element.comparedRun.failData.step.category,
                "priority": element.comparedRun.failData.step.priority,
            },
            "message": element.comparedRun.failData.message,
            "error": element.comparedRun.failData.error,
            "block": {
                "type": element.comparedRun.failData.block.type,
                "code": element.comparedRun.failData.block.code,
                "parameters": {
                    "targetUrl": element.comparedRun.failData.block.parameters.targetUrl,
                    "visibility": element.comparedRun.failData.block.parameters.visibility,
                    "textContent": typeof(element.comparedRun.failData.block.parameters.textContent) == "number" ? element.comparedRun.failData.block.parameters.textContent.toString() : element.comparedRun.failData.block.parameters.textContent,
                    "expectedText": element.comparedRun.failData.block.parameters.expectedText,
                }
            },
            "selectors": element.comparedRun.failData.selectors,
            "website": {
                "currentUrl": {
                    "protocol": element.comparedRun.failData.website.currentUrl.protocol,
                    "host": element.comparedRun.failData.website.currentUrl.host,
                    "path": element.comparedRun.failData.website.currentUrl.path,
                    "search": element.comparedRun.failData.website.currentUrl.search,
                    "hash": element.comparedRun.failData.website.currentUrl.hash
                },
                "currentStatus": element.comparedRun.failData.website.currentStatus
            }
        },
    }
    // console.log(index),
    // console.log(element.failRun.stepCount),
    // console.log(element.comparedRun.stepCount)
    let str = JSON.stringify(updatedformatdifferent);
    differentArray.push(str);
    console.log(str)
    // updatedformatdifferent.append(identicalArray);
});
inputFileIdentical.forEach((element, index) => {
    updatedformatidentical = undefined;
    updatedformatidentical = {
        "failRun": {
            "step": {
                "code": element.failRun.stepCount,
                "label": element.failRun.failData.step !== undefined && element.failRun.failData.step.label != undefined ? element.failRun.failData.step.label : '',
                "number": element.failRun.failData.step.number,
                "category": element.failRun.failData.step.category,
                "priority": element.failRun.failData.step.priority,
            },
            "message": element.failRun.failData.message,
            "error": element.failRun.failData.error,
            "block": {
                "type": element.failRun.failData.block.type,
                "code": element.failRun.failData.block.code,
                "parameters": {
                    "targetUrl": element.failRun.failData.block.parameters.targetUrl,
                    "visibility": element.failRun.failData.block.parameters.visibility,
                    "textContent": typeof(element.failRun.failData.block.parameters.textContent) == "number" ? element.failRun.failData.block.parameters.textContent.toString() : element.failRun.failData.block.parameters.textContent,
                    "expectedText": element.failRun.failData.block.parameters.expectedText,
                }
            },
            "website": {
                "currentUrl": {
                    "protocol": element.failRun.failData.website.currentUrl.protocol,
                    "host": element.failRun.failData.website.currentUrl.host,
                    "path": element.failRun.failData.website.currentUrl.path,
                    "search": element.failRun.failData.website.currentUrl.search,
                    "hash": element.failRun.failData.website.currentUrl.hash
                },
                "currentStatus": element.failRun.failData.website.currentStatus
            }
        },
        "comparedRun": {
            "step": {
                "code": element.comparedRun.stepCount,
                "label": element.comparedRun.failData.step !== undefined && element.failRun.failData.step.label != undefined ? element.failRun.failData.step.label : '',
                "number": element.comparedRun.failData.step.number,
                "category": element.comparedRun.failData.step.category,
                "priority": element.comparedRun.failData.step.priority,
            },
            "message": element.comparedRun.failData.message,
            "error": element.comparedRun.failData.error,
            "block": {
                "type": element.comparedRun.failData.block.type,
                "code": element.comparedRun.failData.block.code,
                "parameters": {
                    "targetUrl": element.comparedRun.failData.block.parameters.targetUrl,
                    "visibility": element.comparedRun.failData.block.parameters.visibility,
                    "textContent": typeof(element.comparedRun.failData.block.parameters.textContent) == "number" ? element.comparedRun.failData.block.parameters.textContent.toString() : element.comparedRun.failData.block.parameters.textContent,
                    "expectedText": element.comparedRun.failData.block.parameters.expectedText,
                }
            },
            "selectors": element.comparedRun.failData.selectors,
            "website": {
                "currentUrl": {
                    "protocol": element.comparedRun.failData.website.currentUrl.protocol,
                    "host": element.comparedRun.failData.website.currentUrl.host,
                    "path": element.comparedRun.failData.website.currentUrl.path,
                    "search": element.comparedRun.failData.website.currentUrl.search,
                    "hash": element.comparedRun.failData.website.currentUrl.hash
                },
                "currentStatus": element.comparedRun.failData.website.currentStatus
            }
        },
    }
    // console.log(element.failRun.stepCount),
    // console.log(element.comparedRun.stepCount)
    let str = JSON.stringify(updatedformatidentical);
    identicalArray.push(str);
    console.log(str)
    // updatedformatidentical.append(identicalArray);
});

string = "{\"different\":["+differentArray+"],\"identical\":["+identicalArray+"]}";
fs.writeFile("./training/HAL9000/" + dataType + "Dataset.json",string, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 