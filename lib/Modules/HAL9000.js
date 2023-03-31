const Interface = require("../Framework/Interface");
const ModuleInterface = require("../Framework/ModuleInterface");
const util = require("util");
const colors = require("colors");
const levenshtein = require("js-levenshtein");
const resemble = require("resemblejs");
var fs = require("fs");
// const requireDir = require("require-dir"); //Issues with browerify ?
const http = require("http");

class HAL9000 {
  #skynet;
  #config;
  #trainDataset;
  #testDataset;
  #screenshotsDataset;
  #verbose = false;

  get skynet() {
    return this.#skynet;
  }

  set skynet(value) {
    this.#skynet = value;
    return this;
  }

  get tensorflow() {
    return this.skynet.tensorflow;
  }

  get skymath() {
    return this.skynet.skymath;
  }

  get config() {
    return this.#config;
  }

  get trainDataset() {
    return this.#trainDataset;
  }

  get testDataset() {
    return this.#testDataset;
  }

  get screenshotsDataset() {
    return this.#screenshotsDataset;
  }

  constructor() {
    Interface.checkImplements(this, ModuleInterface);
    this.#config = require("./HAL9000.config.json");
    this.initialize();
    // console.log(util.inspect(this.config).blue);
  }

  classNames() {
    return ["Identical", "Different"];
  }

  getJson(file) {
    fs.readFile(file + '.json', (err, jsonData) => {
      if (err) {
        console.log('error reading sample.js ', err)
      }
      return (jsonData)
    })
  }

  async generateTrainingData() {
    if (this.config.usePreEncodedData) {
      console.log("TRAIN Pre-Encoded Data Detected")
      const obj = require("../../training/HAL9000/encodedTrainDataset.json");
      console.log("Size Train Dataset : ", obj.arrayInputs.length)
      const trainInputsTensor = this.tensorflow.tensor2d(obj.arrayInputs);
      const trainOutputsTensor = this.tensorflow.tensor2d(obj.arrayOutputs);
      return {
        trainInputsTensor: trainInputsTensor,
        trainOutputsTensor: trainOutputsTensor,
      };
    } else {
      this.#trainDataset = require("../../training/HAL9000/trainDataset.json");
      this.#screenshotsDataset = "../../training/HAL9000/ScreenshotsDataset/";
      // this.#trainDataset = require("E:/Projets/Skynet/training/HAL9000/trainDataset"); //"C:/Users/Esteban/Google Drive/Esteban/Codes/skynet/training/HAL9000/trainDataset"
      // this.#testDataset = require("E:/Projets/Skynet/training/HAL9000/testDataset"); //"C:/Users/Esteban/Google Drive/Esteban/Codes/skynet/training/HAL9000/testDataset"
      // this.#trainDataset = require("C:/Users/Esteban/Google Drive/Esteban/Codes/skynet/training/HAL9000/trainDataset");
      // this.#testDataset = require("C:/Users/Esteban/Google Drive/Esteban/Codes/skynet/training/HAL9000/testDataset");
      const trainInputsArray = [];
      const trainOutputsArray = [];
      const maxQuantityTrain = Math.min(this.trainDataset.different.length, this.trainDataset.identical.length);
      for (let i = 0; i < maxQuantityTrain; i++) {
        let obj = await this.analyse(
          this.trainDataset.different[i].failRun,
          this.trainDataset.different[i].closerRun
        );
        if (obj === false || obj.every((item) => item === 0)) {
          continue;
        } else {
          trainInputsArray.push(obj);
          // console.log("Different");
          // console.log(obj);
          trainOutputsArray.push([0, 1]);
        }
      }

      for (let i = 0; i < maxQuantityTrain; i++) {
        let obj = await this.analyse(
          this.trainDataset.identical[i].failRun,
          this.trainDataset.identical[i].closerRun
        );
        if (obj === false) {
          continue;
        } else {
          trainInputsArray.push(obj);
          // console.log("Identical");
          // console.log(obj);
          trainOutputsArray.push([1, 0]);
        }
      }
      let obj2 = this.shuffleData(trainInputsArray, trainOutputsArray);
      const trainInputsTensor = this.tensorflow.tensor2d(obj2.array1);
      const trainOutputsTensor = this.tensorflow.tensor2d(obj2.array2);
      // console.log("Identical train identical quantity : " + this.trainDataset.identical.length);
      // console.log("Identical train different quantity : " + this.trainDataset.different.length);
      console.log("Size Train Dataset : ", obj2.array1.length)
      return {
        trainInputsTensor: trainInputsTensor,
        trainOutputsTensor: trainOutputsTensor,
      };
    }
  }

  async generateTestingData() {
    if (this.config.usePreEncodedData) {
      console.log("TEST Pre-Encoded Data Detected")
      const obj = require("../../training/HAL9000/encodedTestDataset.json");
      console.log("Size Test Dataset : ", obj.arrayInputs.length)
      const testingInputsTensor = this.tensorflow.tensor2d(obj.arrayInputs);
      const testingOutputsTensor = this.tensorflow.tensor2d(obj.arrayOutputs);
      return {
        testingInputsTensor: testingInputsTensor,
        testingExpectedOutputsTensor: testingOutputsTensor,
      };
    } else {
      this.#testDataset = require("../../training/HAL9000/testDataset.json");
      const testingInputsArray = [];
      const testingOutputsArray = [];
      const maxQuantityTest = Math.min(this.testDataset.different.length, this.testDataset.identical.length);
      for (let i = 0; i < maxQuantityTest; i++) {
        let obj = await this.analyse(
          this.testDataset.different[i].failRun,
          this.testDataset.different[i].closerRun
        );
        if (Array.isArray(obj)) {
          const nullBoolean = (item) => item === 0;
          if (obj.every(nullBoolean)) {
            console.log(this.testDataset.different[i].failRun.runId);
            console.log(this.testDataset.different[i].closerRun.runId);
            continue;
          } else {
            testingInputsArray.push(obj);
            testingOutputsArray.push([0, 1]);
          }
        }
        if (obj === false) {
          console.log(this.testDataset.different[i].failRun.runId);
          console.log(this.testDataset.different[i].closerRun.runId);
          continue;
        } else {
          testingInputsArray.push(obj);
          testingOutputsArray.push([0, 1]);
        }
      }
      for (let i = 0; i < maxQuantityTest; i++) {
        let obj = await this.analyse(
          this.testDataset.identical[i].failRun,
          this.testDataset.identical[i].closerRun
        );
        if (obj === false) {
          continue;
        } else {
          testingInputsArray.push(obj);
          // console.log("Identical");
          // console.log(obj);
          testingOutputsArray.push([1, 0]);
        }
      }
      let obj2 = this.shuffleData(testingInputsArray, testingOutputsArray);
      console.log("Size Test Dataset : ", obj2.array1.length)
      const testingInputsTensor = this.tensorflow.tensor2d(obj2.array1);
      const testingOutputsTensor = this.tensorflow.tensor2d(obj2.array2);
      // console.log("Identical test identical quantity : " + this.testDataset.identical.length);
      // console.log("Identical test different quantity : " + this.testDataset.different.length);
      return {
        testingInputsTensor: testingInputsTensor,
        testingExpectedOutputsTensor: testingOutputsTensor,
      };
    }
  }

  saveDir() {
    return "hal9000";
  }

  shuffleData(array1, array2) {
    let newArray1 = [];
    let newArray2 = [];
    let arrayLength = array1.length;
    let index;
    for (let i = 0; i < arrayLength; i++) {
      index = Math.trunc(Math.random() * array1.length);
      //console.log(index);
      newArray1.push(array1[index]);
      newArray2.push(array2[index]);
      array1.splice(index, 1);
      array2.splice(index, 1);
    }
    return {
      array1: newArray1,
      array2: newArray2,
    };
  }

  async analyse(run1, run2) {
    // console.log(run1);
    // console.log(run2);
    if (
      (Array.isArray(run1) && run1.length == 0) ||
      (Array.isArray(run2) && run2.length == 0)
    ) {
      return false;
    }
    let message1Object = this.HAL9000MessageErrorAnalyser(run1.message);
    let message2Object = this.HAL9000MessageErrorAnalyser(run2.message);
    // console.log(message1Object);
    // console.log(message2Object);
    let timeoutInput = this.HAL9000ArrayDifferenceGrader(
      message1Object.timeoutResult,
      message2Object.timeoutResult
    );
    let errorResultInput = this.HAL9000ArrayDifferenceGrader(
      message1Object.errorResult,
      message2Object.errorResult
    );
    let actionResult = this.HAL9000ArrayDifferenceGrader(
      message1Object.actionResult,
      message2Object.actionResult
    );
    let statusResult = this.HAL9000ArrayDifferenceGrader(
      message1Object.statusResult,
      message2Object.statusResult
    );
    let subjectResult = this.HAL9000ArrayDifferenceGrader(
      message1Object.subjectResult,
      message2Object.subjectResult
    );
    let failDataErrorInput;
    if (
      Math.max(
        (run1.error.name || run1.error).length,
        (run2.error.name || run2.error).length
      ) === 0
    ) {
      failDataErrorInput = 0;
    } else {
      failDataErrorInput =
        Math.abs(
          levenshtein(
            run1.error.name || run1.error,
            run2.error.name || run2.error
          )
        ) /
        Math.max(
          (run1.error.name || run1.error).length,
          (run2.error.name || run2.error).length
        );
    }
    let setCountInput = this.HAL9000Encoder(
      run1.step.code.toString(),
      run2.step.code.toString()
    );
    let failDataStepLabelInput = this.HAL9000Encoder(
      run1.step.label,
      run2.step.label
    );
    let failDataStepNumberInput = this.HAL9000Encoder(
      run1.step.number,
      run2.step.number
    );
    let failDataStepCategoryInput = this.HAL9000Encoder(
      run1.step.category,
      run2.step.category
    );
    let failDataStepPriorityInput = this.HAL9000Encoder(
      run1.step.priority,
      run2.step.priority
    );
    let failDataBlockTypeInput = this.HAL9000Encoder(
      run1.block.type,
      run2.block.type
    );
    let failDataBlockCodeInput = this.HAL9000Encoder(
      run1.block.code,
      run2.block.code
    );
    let failDataBlockParametersTargetUrlInput = this.HAL9000Encoder(
      run1.block.parameters.targeturl,
      run2.block.parameters.targeturl
    );
    let failDataBlockParametersVisibilityInput = this.HAL9000Encoder(
      run1.block.parameters.visibility,
      run2.block.parameters.visibility
    );
    let failDataBlockParametersTextContentInput = this.HAL9000Encoder(
      run1.block.parameters.textContent,
      run2.block.parameters.textContent
    );
    let failDataBlockParametersExpectedTextInput = this.HAL9000Encoder(
      run1.block.parameters.expectedText,
      run2.block.parameters.expectedText
    );
    let failDataSelectorsInput = this.HAL9000Encoder(
      run1.selectors,
      run2.selectors
    );
    let failDataWebsiteCurrentUrlProtocolInput = this.HAL9000Encoder(
      run1.website.currentUrl.protocol,
      run2.website.currentUrl.protocol
    );
    let failDataWebsiteCurrentUrlHostInput = this.HAL9000Encoder(
      run1.website.currentUrl.host,
      run2.website.currentUrl.host
    );
    let failDataWebsiteCurrentUrlPathInput = this.HAL9000Encoder(
      run1.website.currentUrl.path,
      run2.website.currentUrl.path
    );
    // if ((run1.step.category && run2.step.category) == "cart_add") {
    //   failDataWebsiteCurrentUrlPathInput = 0;
    //   console.log("Exception Encodeur cart_add  ");
    // }
    let failDataWebsiteCurrentUrlSearchInput = this.HAL9000Encoder(
      run1.website.currentUrl.search,
      run2.website.currentUrl.search
    );
    let failDataWebsiteCurrentUrlHashInput = this.HAL9000Encoder(
      run1.website.currentUrl.hash,
      run2.website.currentUrl.hash
    );
    let faildataWebsiteCurrentStatusInput = this.HAL9000Encoder(
      run1.website.currentStatus,
      run2.website.currentStatus,
      true
    );
    let failDataDuration = this.HAL9000Encoder(run1.duration, run2.duration);
    let failDataTerminal = this.HAL9000Encoder(
      run1.terminal,
      run2.terminal,
      true
    );
    let failDataEngine = this.HAL9000Encoder(run1.engine, run2.engine, true);
    let failDataIsMobile = this.HAL9000Encoder(
      run1.isMobile,
      run2.isMobile,
      true
    );
    // const path = `../../training/HAL9000/ScreenshotsDataset/${run1.runId}.json`
    // let screenshotsfile1 = this.getJson(`../../training/HAL9000/ScreenshotsDataset/${run1.runId}.json`)
    // let screenshotsfile2 = this.getJson(`../../training/HAL9000/ScreenshotsDataset/${run2.runId}.json`)


    // // let screenshotsfile2 = require(this.screenshotsDataset+run2.runId+".json"

    // let failDataViewportDifference = resemble(screenshotsfile2.screenshots.viewport)
    //   .compareTo(run2.screenshots.viewport)
    //   .onComplete(function () {
    //     return data.misMatchPercentage;
    //     /*
    //   {
    //     misMatchPercentage : 100, // %
    //     isSameDimensions: true, // or false
    //     getImageDataUrl: function(){}
    //   }
    //   */
    //   });
    // let promise1 = new Promise((resolve, reject) => {
    //   http.get(`../../Skynet/training/HAL9000/ScreenshotsDataset/${run1.runId}.json`, function (res) {

    //     var test = "";

    //     res.on('data', function (buf) {
    //       test += buf;
    //     });

    //     res.on('end', function () {
    //       resolve(test);
    //     });
    //   })
    // });
    let result;
    let result2;

    if (this.config.is_web) {
      let promise1 = new Promise((resolve, reject) => {

        const request = new XMLHttpRequest();
        request.open('GET', `../../Skynet/training/HAL9000/ScreenshotsDataset/${run1.runId}.json`, true);
        request.responseType = 'json';
        request.onload = (e) => {
          resolve(request.response)
        };
        request.send();
      });
      result = await promise1;
  
      let promise2 = new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `../../Skynet/training/HAL9000/ScreenshotsDataset/${run2.runId}.json`, true);
        request.responseType = 'json';
        request.onload = (e) => {
          resolve(request.response)
        };
        request.send();
      });
      result2 = await promise2;
    } else {
      result = require(`../../training/HAL9000/ScreenshotsDataset/${run1.runId}.json`)
      result2 = require(`../../training/HAL9000/ScreenshotsDataset/${run2.runId}.json`)
    }


    let failDataScreenshotDifference = 0;
    if (result.screenshots.hasOwnProperty('fullscreen') && result2.screenshots.hasOwnProperty('fullscreen')) {
      const compareImages = require("resemblejs/compareImages");
      const options = {
        scaleToSameSize: true,
        ignore: "antialiasing"
      };
      const data = await compareImages(result.screenshots.fullscreen, result2.screenshots.fullscreen, options);
      failDataScreenshotDifference = parseFloat(data.misMatchPercentage)
    };

    let failDataViewportDifference = 0;
    if (result.screenshots.hasOwnProperty('viewport') && result2.screenshots.hasOwnProperty('viewport')) {
      const compareImages = require("resemblejs/compareImages");
      const options = {
        scaleToSameSize: true,
        ignore: "antialiasing"
      };
      const data = await compareImages(result.screenshots.viewport, result2.screenshots.viewport, options);
      failDataViewportDifference = parseFloat(data.misMatchPercentage)
    }

    console.log("New comparison")
    console.log(failDataScreenshotDifference)
    console.log(failDataViewportDifference)

    let failDataScenarioId = this.HAL9000Encoder(
      run1.scenarioId,
      run2.scenarioId,
      true
    );
    let failDataCustomerId = this.HAL9000Encoder(
      run1.customerId,
      run2.customerId,
      true
    );
    let failDataRevisionId = this.HAL9000Encoder(
      Number((run1.revisionId + "").split(".")[1]),
      Number((run2.revisionId + "").split(".")[1])
    );
    // if(isNaN(failDataRevisionId)) {
    //   console.log(run1.runId)
    //   console.log(run2.runId)
    // }
    let failDataGeolocalisation = this.HAL9000Encoder(
      run1.geolocalisation,
      run2.geolocalisation,
      true
    );
    let failDataTerminalType = this.HAL9000Encoder(
      run1.terminalType,
      run2.terminalType,
      true
    );
    let failDataUseRandom = this.HAL9000Encoder(
      run1.useRandom,
      run2.useRandom,
      true
    );

    const A = [
      timeoutInput,
      errorResultInput,
      actionResult,
      statusResult,
      subjectResult,
      setCountInput,
      failDataErrorInput,
      failDataStepLabelInput,
      failDataStepNumberInput,
      failDataStepCategoryInput,
      failDataStepPriorityInput,
      failDataBlockTypeInput,
      failDataBlockCodeInput,
      failDataBlockParametersTargetUrlInput,
      failDataBlockParametersVisibilityInput,
      failDataBlockParametersTextContentInput,
      failDataBlockParametersExpectedTextInput,
      failDataSelectorsInput,
      failDataWebsiteCurrentUrlProtocolInput,
      failDataWebsiteCurrentUrlHostInput,
      failDataWebsiteCurrentUrlPathInput,
      failDataWebsiteCurrentUrlSearchInput,
      failDataWebsiteCurrentUrlHashInput,
      faildataWebsiteCurrentStatusInput,
      failDataDuration,
      failDataTerminal,
      failDataEngine,
      failDataIsMobile,
      failDataScreenshotDifference, //failDataScreenshotDifference
      failDataViewportDifference, //failDataViewportDifference
      failDataScenarioId,
      failDataCustomerId,
      failDataRevisionId,
      failDataGeolocalisation,
      failDataTerminalType,
      failDataUseRandom,
    ];

    for (let i = 0; i < A.length; i++) {
      if (isNaN(A[i])) {
        console.log(i + 1);
      }
    }

    // console.log([
    //   timeoutInput,
    //   errorResultInput,
    //   actionResult,
    //   statusResult,
    //   subjectResult,
    //   setCountInput,
    //   failDataErrorInput,
    //   failDataStepLabelInput,
    //   failDataStepNumberInput,
    //   failDataStepCategoryInput,
    //   failDataStepPriorityInput,
    //   failDataBlockTypeInput,
    //   failDataBlockCodeInput,
    //   failDataBlockParametersTargetUrlInput,
    //   failDataBlockParametersVisibilityInput,
    //   failDataBlockParametersTextContentInput,
    //   failDataBlockParametersExpectedTextInput,
    //   failDataSelectorsInput,
    //   failDataWebsiteCurrentUrlProtocolInput,
    //   failDataWebsiteCurrentUrlHostInput,
    //   failDataWebsiteCurrentUrlPathInput,
    //   failDataWebsiteCurrentUrlSearchInput,
    //   failDataWebsiteCurrentUrlHashInput,
    //   faildataWebsiteCurrentStatusInput,
    //   failDataDuration,
    //   failDataTerminal,
    //   failDataEngine,
    //   failDataIsMobile,
    //   0, //failDataScreenshotDifference
    //   0, //failDataViewportDifference
    //   failDataScenarioId,
    //   failDataCustomerId,
    //   failDataRevisionId,
    //   failDataGeolocalisation,
    //   failDataTerminalType,
    //   failDataUseRandom,
    // ]);

    return [
      timeoutInput,
      errorResultInput,
      actionResult,
      statusResult,
      subjectResult,
      setCountInput,
      failDataErrorInput,
      failDataStepLabelInput,
      failDataStepNumberInput,
      failDataStepCategoryInput,
      failDataStepPriorityInput,
      failDataBlockTypeInput,
      failDataBlockCodeInput,
      failDataBlockParametersTargetUrlInput,
      failDataBlockParametersVisibilityInput,
      failDataBlockParametersTextContentInput,
      failDataBlockParametersExpectedTextInput,
      failDataSelectorsInput,
      failDataWebsiteCurrentUrlProtocolInput,
      failDataWebsiteCurrentUrlHostInput,
      failDataWebsiteCurrentUrlPathInput,
      failDataWebsiteCurrentUrlSearchInput,
      failDataWebsiteCurrentUrlHashInput,
      faildataWebsiteCurrentStatusInput,
      failDataDuration,
      failDataTerminal,
      failDataEngine,
      failDataIsMobile,
      failDataScreenshotDifference,
      failDataViewportDifference,
      failDataScenarioId,
      failDataCustomerId,
      failDataRevisionId,
      failDataGeolocalisation,
      failDataTerminalType,
      failDataUseRandom,
    ];
  }

  initialize(verbose) {
    this.#verbose = verbose;
  }

  definedParameters(param1, param2) {
    if (
      (param1 === (undefined || null) || typeof param1 === "undefined") &&
      (param2 === (undefined || null) || typeof param2 === "undefined")
    ) {
      return [];
    } else {
      if (
        param1 === (undefined || null) ||
        typeof param1 === "undefined" ||
        param2 === (undefined || null) ||
        typeof param2 === "undefined"
      ) {
        if (param1 === (undefined || null) || typeof param1 === "undefined") {
          return [param2];
        } else {
          return [param1];
        }
      } else {
        return [param1, param2];
      }
    }
  }

  async moduleMassPredict(inputs) {
    const output = {};
    const promises = [];
    if (
      inputs.baseRunFailData !== undefined &&
      inputs.runFailDatas !== undefined
    ) {
      Object.entries(inputs.runFailDatas).forEach(async ([runId, failData]) => {
        promises.push(
          this.skynet
            .predict({
              failRun: inputs.baseRunFailData,
              runToCompare: failData,
            })
            .then((result) => {
              output[runId] = result;
            })
        );
      });
    }
    await Promise.all(promises);

    return output;
  }

  moduleEncoder(inputs) {
    return this.analyse(inputs.failRun, inputs.runToCompare);
  }

  HAL9000Encoder(param1, param2, identical = false) {
    let parameter;
    let parameter2;
    let definedParameters = this.definedParameters(param1, param2);
    if (definedParameters.length === 0) {
      return 0;
    }
    if (definedParameters.length === 1) {
      parameter = definedParameters[0];
      if (typeof parameter == "string") {
        return 1;
      }
      if (typeof parameter == "number") {
        if (isNaN(parameter)) {
          console.log("ERROR ENCODER NaN");
        }
        return parameter;
      }
      if (typeof parameter == "boolean") {
        return 1;
      }
      if (Array.isArray(parameter)) {
        let temp = 0;
        for (let i = 0; i < parameter.length; i++) {
          temp = temp + this.HAL9000Encoder(parameter[i], undefined);
        }
        if (parameter.length === 0) {
          return 0;
        } else {
          if (isNaN(temp / parameter.length)) {
            console.log("ERROR ENCODER NaN");
          }
          return temp / parameter.length;
        }
      }
    }
    if (definedParameters.length == 2) {
      parameter = definedParameters[0];
      parameter2 = definedParameters[1];
      if (typeof parameter == "boolean" && typeof parameter2 == "boolean") {
        if (parameter === parameter2) {
          return 0;
        } else {
          return 1;
        }
      } else if (
        typeof parameter == "string" &&
        typeof parameter2 == "string"
      ) {
        if (Math.max(parameter.length, parameter2.length) === 0) {
          return 0;
        } else {
          if (
            isNaN(
              Math.abs(levenshtein(parameter, parameter2)) /
              Math.max(parameter.length, parameter2.length)
            )
          ) {
            console.log("ERROR ENCODER NaN");
          }
          return (
            Math.abs(levenshtein(parameter, parameter2)) /
            Math.max(parameter.length, parameter2.length)
          );
        }
      } else if (
        typeof parameter == "number" &&
        typeof parameter2 == "number"
      ) {
        if (identical) {
          if (parameter === parameter2) {
            return 0;
          } else {
            return 1;
          }
        } else {
          return Math.abs(parameter - parameter2);
        }
      } else if (Array.isArray(parameter) && Array.isArray(parameter2)) {
        let temp2 = 0;
        let loopsize = Math.max(parameter.length, parameter2.length);
        while (parameter.length < loopsize) {
          parameter.push(undefined);
        }
        while (parameter2.length < loopsize) {
          parameter2.push(undefined);
        }
        for (let i = 0; i < loopsize; i++) {
          temp2 = temp2 + this.HAL9000Encoder(parameter[i], parameter2[i]);
        }
        if (loopsize === 0) {
          return 0;
        } else {
          if (isNaN(temp2 / loopsize)) {
            console.log("ERROR ENCODER NaN");
          }
          return temp2 / loopsize;
        }
      } else if (
        (Array.isArray(parameter) || Array.isArray(parameter2)) &&
        (!Array.isArray(parameter) || !Array.isArray(parameter2))
      ) {
        let arrayParam;
        let fixedParam;
        let temp3 = 0;
        if (Array.isArray(parameter)) {
          arrayParam = parameter;
          fixedParam = parameter2;
        } else {
          arrayParam = parameter2;
          fixedParam = parameter;
        }
        for (let i = 0; i < arrayParam.length; i++) {
          temp3 = temp3 + this.HAL9000Encoder(arrayParam[i], fixedParam);
        }
        if (arrayParam.length === 0) {
          return 0;
        } else {
          if (isNaN(temp3 / arrayParam.length)) {
            console.log("ERROR ENCODER NaN");
          }
          return temp3 / arrayParam.length;
        }
      } else {
        console.log(
          "ERROR ENCODER : DIFFERENT TYPES OF PARAMETERS - RETURNING -1"
        );
        console.log(
          "parameter1 : " + parameter + "  typeof =  " + typeof parameter
        );
        console.log(
          "parameter2 : " + parameter2 + "  typeof =   " + typeof parameter2
        );
        return -1;
      }
    }
  }

  HAL9000MessageErrorAnalyser(string) {
    const timeoutKey = [/(\d+)(?=\s*ms)/ms];
    const errorKeys = ["timeout", "timed out", "exceeded"];
    const actionKeys = ["select", "wait", "open", "switch"];
    const statusKeys = ["unable", "failed", "unexpected", "visible", "hidden"];
    const subjectKeys = [
      "value",
      "url",
      "landing url",
      "element",
      "tab",
      "selector",
    ];
    let timeoutResult = [];
    let errorResult = [];
    let actionResult = [];
    let statusResult = [];
    let subjectResult = [];
    const allKeysArray = [
      timeoutKey,
      errorKeys,
      actionKeys,
      statusKeys,
      subjectKeys,
    ];
    string = string.toLowerCase();
    allKeysArray.forEach((element, index) => {
      element.forEach((key) => {
        if (index === 0) {
          if (this.stringAnalyser(string, key) != undefined) {
            timeoutResult.push(this.stringAnalyser(string, key));
          }
        }
        if (index === 1) {
          if (this.stringAnalyser(string, key) != undefined) {
            errorResult.push(this.stringAnalyser(string, key));
          }
        }
        if (index === 2) {
          if (this.stringAnalyser(string, key) != undefined) {
            actionResult.push(this.stringAnalyser(string, key));
          }
        }
        if (index === 3) {
          if (this.stringAnalyser(string, key) != undefined) {
            statusResult.push(this.stringAnalyser(string, key));
          }
        }
        if (index === 4) {
          if (this.stringAnalyser(string, key) != undefined) {
            subjectResult.push(this.stringAnalyser(string, key));
          }
        }
      });
    });
    if ("url" in subjectResult && "landing url" in subjectResult) {
      const index = subjectResult.indexOf("url");
      if (index > -1) {
        subjectResult.splice(index, 1);
      }
    }
    // console.log({
    //   timeoutResult: timeoutResult,
    //   errorResult: errorResult,
    //   actionResult: actionResult,
    //   statusResult: statusResult,
    //   subjectResult: subjectResult,
    // });
    // console.log("\n")
    return {
      timeoutResult: timeoutResult,
      errorResult: errorResult,
      actionResult: actionResult,
      statusResult: statusResult,
      subjectResult: subjectResult,
    };
  }

  stringAnalyser(string, key) {
    if (string.match(key) != null) {
      return string.match(key)[0];
    }
  }

  HAL9000ArrayDifferenceGrader(array1, array2) {
    let MinArray;
    let MaxArray;
    let max_size;
    let min_size;
    // console.log(array1, array1.length);
    // console.log(array2, array2.length);
    if (array1.length === 0 && array2.length === 0) {
      // console.log("detected")
      return 0;
    }
    if (array2.length === 0) {
      return array1.length;
    }
    if (array1.length === 0) {
      return array2.length;
    }
    if (array2.length === 0) {
      return array1.length;
    }
    // console.log(array1);
    // console.log(array2);
    if (array1.length <= array2.length) {
      MinArray = array1;
      MaxArray = array2;
      max_size = array2.length;
      min_size = array1.length;
    } else {
      MinArray = array1;
      MaxArray = array2;
      max_size = array1.length;
      min_size = array2.length;
    }
    let score = max_size - min_size;
    for (let i = 0; i < min_size; i += 1) {
      if (!MaxArray.includes(MinArray[i])) {
        score = score + 1;
      }
    }
    // if(score / max_size === NaN ) {
    //   console.log(array1)
    //   console.log(array2)
    // }
    return score / max_size;
  }

  encoderDebug(array) {
    let newArray = []
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

    for (let i = 0; i < array.length; i++) {
      let newEntry = []
      for (let j = 0; j < array[i].length; j++) {
        newEntry.push(dimensionlist[j] + " : " + array[i][j])
      }
      newArray.push(newEntry);
    }

    return newArray;
  }

  // buildStepCountInput() {
  //     const stepCountCurrentRunArray = this.skymath.stringNumbersToArray(run1.stepCount,'-');
  //     const stepCountExistingRunArray = this.skymath.stringNumbersToArray(run2.stepCount,'-');
  //     if (stepCountCurrentRunArray === stepCountExistingRunArray) {
  //         this.#stepCountInput = 0
  //     } else {
  //         if (stepCountCurrentRunArray.length < stepCountExistingRunArray.length) {
  //             for (let i = 0; i < (stepCountExistingRunArray.length - stepCountCurrentRunArray.length); i++ ) {
  //                 stepCountCurrentRunArray.push(undefinedValue);
  //             }
  //         } else {
  //             for (let i = 0; i < (stepCountCurrentRunArray.length - stepCountExistingRunArray.length); i++ ) {
  //                 stepCountExistingRunArray.push(undefinedValue);
  //             }
  //         }
  //         for (let j = 0; j < stepCountCurrentRunArray.length; j++) {
  //             if (stepCountCurrentRunArray[j] != stepCountExistingRunArray[j]) {
  //                 this.#stepCountInput = stepCountCurrentRunArray.length - j;
  //                 break;
  //             }
  //         }
  //     }
  // }
}

module.exports = new HAL9000();
