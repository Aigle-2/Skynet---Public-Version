const Interface = require("./Interface");
const util = require("util");
const exp = require("constants");
try {
  window.saveOutputLoop = false;
} catch (error) {
  // console.log(error.stack.red);
}

class Skynet {
  #tensorflow;
  #moduleInstance;
  #skymath;
  #config;
  #model;
  #testingData;
  #debug = false;
  #verbose;
  #previousTrainingResults = [];
  #currentBestLearningRate;
  #originalLearningRate;
  #currentBestSuccessRatio = 0;
  #history;
  #trainingHistory = [];
  #trainingData;
  #storage = "file";
  #loadedModel = false;
  #maxAcc = 0;
  #minLoss;
  #maxValAcc = 0;
  #minValLoss;
  #maxTestingAcc = 0;

  get tensorflow() {
    return this.#tensorflow;
  }

  get skymath() {
    return this.#skymath;
  }

  get module() {
    return this.#moduleInstance;
  }

  get config() {
    return this.#config;
  }

  get moduleConfig() {
    return this.module.config;
  }

  get model() {
    return this.#model;
  }

  get previousTrainingResults() {
    return this.#previousTrainingResults;
  }

  get originalLearningRate() {
    return this.#originalLearningRate;
  }

  get currentBestLearningRate() {
    return this.#currentBestLearningRate;
  }

  get currentBestSuccessRatio() {
    return this.#currentBestSuccessRatio;
  }

  get history() {
    return this.#history;
  }

  get trainingHistory() {
    return this.#trainingHistory;
  }

  get trainingData() {
    return this.#trainingData;
  }

  get testingData() {
    return this.#testingData;
  }

  get verbose() {
    return this.#verbose;
  }

  constructor(moduleInstance, tensorflow) {
    this.#tensorflow = tensorflow;
    this.#skymath = require("./Skymath")(this);
    this.#loadModule(moduleInstance);
    this.#config = require("./Skynet.config.json");
    this.#debug =
      this.#config.debug !== undefined ? this.#config.debug : this.#debug;
    this.#verbose = this.#config.verbose;
    // this.#model = this.#generateModel();
    this.#currentBestLearningRate = this.moduleConfig.compiler.optimizer;
    this.#originalLearningRate = this.moduleConfig.compiler.optimizer;
  }

  set debug(value) {
    this.#debug = value;
  }

  useFileStorage() {
    this.#storage = "file";
  }

  useWebStorage() {
    this.#storage = "localstorage";
  }

  #loadModule(moduleInstance) {
    const ModuleInterface = require("./ModuleInterface");
    Interface.checkImplements(moduleInstance, ModuleInterface);
    moduleInstance.skynet = this;
    this.#moduleInstance = moduleInstance;
  }

  #generateModel() {
    if (this.model === undefined) {
      if (this.#debug && this.#loadedModel)
        console.log("Importation error : undefined model");
      this.createModel();
    }
  }

  #compileModel() {
    const config_compile = {
      optimizer: this.tensorflow.train.sgd(
        this.moduleConfig.compiler.optimizer
      ),
      loss: this.moduleConfig.compiler.loss,
      metrics: ["accuracy"],
    };
    //console.log(util.inspect(this.model).blue);
    this.model.compile(config_compile);
  }

  createModel() {
    const model = this.tensorflow.sequential();

    let config;
    for (let i = 0; i < this.moduleConfig.shape.length; i++) {
      config = this.moduleConfig.shape[i];

      if (i === 0) {
        const options = {
          units: config.units,
          useBias: config.useBias === undefined ? true : config.useBias,
          activation:
            config.activation === undefined ? "relu" : config.activation,
          inputShape: config.inputShape,
        };
        model.add(this.tensorflow.layers.dense(options));
      } else {
        if (this.moduleConfig.shape[i].type === "dense") {
          const options = {
            units: config.units,
            useBias: config.useBias === undefined ? true : config.useBias,
            activation:
              config.activation === undefined ? "relu" : config.activation,
          };
          if (this.moduleConfig.shape[i].regularizer != undefined) {
            options.kernel_regularizer = this.moduleConfig.shape[i].regularizer;
          }
          model.add(this.tensorflow.layers.dense(options));
        } else if (this.moduleConfig.shape[i].type === "dropout") {
          const options = {
            rate: config.rate,
          };
          model.add(this.tensorflow.layers.dropout(options));
        } else if (this.moduleConfig.shape[i].type === "conv2d") {
          const options = {
            filters: config.filters,
            kernelSize: config.kernelSize,
            strides: config.strides,
            padding: config.padding === undefined ? "valid" : config.padding,
            dataformat:
              config.dataformat === undefined
                ? "channelsFirst"
                : config.dataformat,
            useBias: config.useBias === undefined ? true : config.useBias,
            activation:
              config.activation === undefined ? "relu" : config.activation, //('elu'|'hardSigmoid'|'linear'|'relu'|'relu6'| 'selu'|'sigmoid'|'softmax'|'softplus'|'softsign'|'tanh'|'swish'|'mish')
            inputShape: config.inputShape,
          };
          model.add(this.tensorflow.layers.conv2d(options));
        } else if (this.moduleConfig.shape[i].type === "averagePooling2d") {
          const options = {
            poolSize: config.poolSize,
            strides: config.strides,
            padding: config.padding === undefined ? "valid" : config.padding,
            dataformat:
              config.dataformat === undefined
                ? "channelsFirst"
                : config.dataformat,
            inputShape: config.inputShape, // [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS]
            //kernelInitializer: 'varianceScaling', // ('constant'|'glorotNormal'|'glorotUniform'|'heNormal'|'heUniform'|'identity'| 'leCunNormal'|'leCunUniform'|'ones'|'orthogonal'|'randomNormal'| 'randomUniform'|'truncatedNormal'|'varianceScaling'|'zeros'|string|tf.initializers.Initializer)
          };
          model.add(this.tensorflow.layers.averagePooling2d(options));
        } else if (this.moduleConfig.shape[i].type === "maxPooling2d") {
          const options = {
            poolSize: config.poolSize,
            strides: config.strides,
            padding: config.padding === undefined ? "valid" : config.padding,
            dataformat:
              config.dataformat === undefined
                ? "channelsFirst"
                : config.dataformat,
            inputShape: config.inputShape,
          };
          model.add(this.tensorflow.layers.maxPooling2d(options));
        } else if (this.moduleConfig.shape[i].type === "flatten") {
          const options = {
            dataformat:
              config.dataformat === undefined
                ? "channelsFirst"
                : config.dataformat,
            inputShape: config.inputShape,
          };
          model.add(this.tensorflow.layers.flatten(options));
        }
      }
    }
    this.#model = model;
    model.summary()
  }

  async initialize(verbose) {
    if (!this.#loadedModel) {
      this.#generateModel();
    }
    this.#compileModel();
    this.#verbose = verbose;
    this.module.initialize(verbose);
  }

  save() {
    const path = require("path");
    var moment = require("moment-timezone");
    const fs = require("fs");
    const baseDir =
      (this.#storage === "file"
        ? path.dirname(require("require-main-filename")())
        : "") +
      "/models/" +
      this.module.saveDir();
    const versionDir = moment().tz("Europe/Paris").format("YYYYMMDD-HHmmss");
    const destination = baseDir + "/" + versionDir;
    if (this.#storage === "file") fs.mkdirSync(baseDir);
    return this.#model.save(this.#storage + "://" + destination).then(() => {
      console.log("Saved model in ".yellow + destination.yellow.bold);
    });
  }

  async load(origin) {
    if (origin === undefined) return;
    const path = require("path");
    const baseDir =
      (this.#storage === "file"
        ? path.dirname(require("require-main-filename")())
        : "") +
      "/models/" +
      this.module.saveDir();
    const destination =
      baseDir +
      "/" +
      origin +
      (this.#storage === "file" ? "/" + origin + ".json" : "");
    this.#model = await this.tensorflow.loadLayersModel(
      this.#storage + "://" + destination
    );
    if (this.#verbose)
      console.log("Loaded model from ".yellow + destination.yellow.bold);
    this.#loadedModel = true;
    return this.model;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async exportModel(origin) {
    await this.#model.save("downloads://" + origin);
  }

  async generateData(generateTesting = true) {
    this.#trainingData = await this.module.generateTrainingData();
    if (generateTesting) {
      this.#testingData = await this.module.generateTestingData();
    }
  }

  train(saveOutput) {
    saveOutput = saveOutput === undefined ? false : saveOutput;
    window.saveOutputLoop = window.saveOutputLoop === undefined ? false : window.saveOutputLoop;
    window.stopOutputLoop = window.stopOutputLoop === undefined ? false : window.stopOutputLoop;
    return new Promise(async (resolve, reject) => {
      this.#previousTrainingResults = [];
      if (this.#testingData === undefined) {
        this.#trainingData = await this.module.generateTrainingData();
      }
      if (this.#testingData === undefined) {
        this.#testingData = await this.module.generateTestingData();
        if (this.config.debug)
          console.log(this.#testingData.testingExpectedOutputsTensor);
      }
      let count = 0;
      const trainConfig = {
        stepsPerEpoch: null,
        shuffle: true,
        epochs: this.moduleConfig.trainer.epochNumber,
        verbose: false,
        //validationData: [this.#testingData.testingInputsTensor, this.#testingData.testingExpectedOutputsTensor],
        validationSplit: 0.1,
        callbacks: {
          onTrainBegin: this.#onTrainBegin.bind(this),
        },
      };
      let success_ratio = 0.0;
      this.#history = {
        history: {
          val_acc: [0],
        },
      }; //to have a history object for while condition
      while (
        (success_ratio < this.moduleConfig.trainer.testingTreshold ||
          this.history.history.val_acc[0] <
          this.moduleConfig.trainer.testingTreshold) &&
        count < this.moduleConfig.trainer.hardLimit
      ) {
        if (window.stopOutputLoop) {
          let value = prompt("Combien de temps tu veux attendre en secondes? 0 pour enlever le mode pause");

          if (value.toLowerCase() === "0") {
            window.stopOutputLoop = false;
          } else {
            await this.wait(parseInt(value) * 1000);
          }
          continue;
        }
        count++;
        // console.log(this.#trainingData.trainInputsTensor.shape)
        // console.log(this.#trainingData.trainOutputsTensor.shape)
        this.#history = await this.model
          .fit(
            this.#trainingData.trainInputsTensor,
            this.#trainingData.trainOutputsTensor,
            trainConfig
          )
        // .catch((error) => {
        //   console.log(count + " " + error.message)
        //   // reject(error);
        // });
        this.#trainingHistory.push(this.#history);
        success_ratio = await this.validate().catch((error) => {
          reject(error);
        });
        if (this.moduleConfig.supervisor) {
          this.#trainingSupervisor(count);
        }
        if (typeof this.moduleConfig.compiler.optimizer === "string") {
          this.moduleConfig.compiler.optimizer = Number(
            this.moduleConfig.compiler.optimizer
          );
        }
        if (typeof this.moduleConfig.trainer.temporalCoefficient === "string") {
          this.moduleConfig.trainer.temporalCoefficient = Number(
            this.moduleConfig.trainer.temporalCoefficient
          );
        }
        if (this.verbose == 1 || this.verbose == 2) {
          //this.config.debug
          console.log(
            (
              "%cTraining iteration " +
              count +
              " - Testing Accuracy " +
              (success_ratio * 100).toFixed(4) +
              "% %c \n" +
              "Acc : " +
              (this.#history.history.acc[0] * 100).toFixed(2) +
              "%            Val_acc : " +
              (this.#history.history.val_acc[0] * 100).toFixed(2) +
              "% \n" +
              "Loss : " +
              this.#history.history.loss[0].toFixed(4) +
              "            Val_loss : " +
              this.#history.history.val_loss[0].toFixed(4) +
              "\n" +
              "Learning Rate : " +
              this.moduleConfig.compiler.optimizer.toFixed(8) +
              "   Temporal Coefficient : " +
              this.moduleConfig.trainer.temporalCoefficient.toFixed(3)
            ).yellow,
            "color: blue",
            "color: red"
          );
        }
        if (this.verbose == 2) {
          if (this.#minLoss === undefined) {
            this.#minLoss = this.#history.history.loss[0];
          } else {
            this.#minLoss = Math.min(
              this.#history.history.loss[0],
              this.#minLoss
            );
          }
          if (this.#minValLoss === undefined) {
            this.#minValLoss = this.#history.history.val_loss[0];
          } else {
            this.#minValLoss = Math.min(
              this.#history.history.val_loss[0],
              this.#minValLoss
            );
          }
          this.#maxTestingAcc = Math.max(this.#maxTestingAcc, success_ratio);
          this.#maxAcc = Math.max(this.#maxAcc, this.#history.history.acc[0]);
          this.#maxValAcc = Math.max(
            this.#maxValAcc,
            this.#history.history.val_acc[0]
          );
          console.log(
            (
              "%cMax Testing Accuracy : " +
              (this.#maxTestingAcc * 100).toFixed(4) +
              "% %c \n" +
              "Max Acc : " +
              (this.#maxAcc.toFixed(4) * 100).toFixed(2) +
              "%   " +
              "Max Val Acc : " +
              (this.#maxValAcc.toFixed(4) * 100).toFixed(2) +
              "% \n" +
              "Min Loss : " +
              this.#minLoss.toFixed(4) +
              "   " +
              "Min Val Loss : " +
              this.#minValLoss.toFixed(4) +
              " \n"
            ).yellow,
            "color:green",
            "color:black"
          );
        }
        if (window.saveOutputLoop) {
          console.log("Saving Model")
          await this.save().catch((error) => {
            console.log(error.message.red);
          })

          window.saveOutputLoop = false;

        };
      }
      if (saveOutput)
        await this.save().catch((error) => {
          console.log(error.message.red);
        });
      resolve(success_ratio);
    });
  }

  #trainingSupervisor(iteration) {
    this.moduleConfig.compiler.optimizer =
      this.moduleConfig.compiler.optimizer -
      ((this.originalLearningRate *
        this.moduleConfig.trainer.temporalCoefficient) /
        this.moduleConfig.trainer.hardLimit) *
      Math.exp(
        (-iteration * this.moduleConfig.trainer.temporalCoefficient) /
        this.moduleConfig.trainer.hardLimit
      ) *
      1;
  }

  #onTrainBegin(logs) {
    this.model.optimizer.setLearningRate(this.moduleConfig.compiler.optimizer);
  }

  getLastLayerSize() {
    return this.moduleConfig.shape[this.moduleConfig.shape.length - 1].units;
  }

  getFirstLayerSize() {
    return this.moduleConfig.shape[0].units;
  }

  getShapeSize() {
    return this.moduleConfig.shape.length;
  }

  saveEncoding(tensor, type, encoderDebug = false, moduleInstance = "") {
    console.log(tensor)
    if (type === "testing") {
      console.log("testing")
      let array1 = this.skymath.tensor_to_matrix(
        tensor.testingInputsTensor,
        tensor.testingInputsTensor.shape[0],
        this.getFirstLayerSize()
      );
      let array2 = this.skymath.tensor_to_matrix(
        tensor.testingExpectedOutputsTensor,
        tensor.testingExpectedOutputsTensor.shape[0],
        this.getLastLayerSize()
      );
      let obj = new Object()
      obj.arrayInputs = array1
      obj.arrayOutputs = array2
      return JSON.stringify(obj)
    }
    else if (type === "training") {
      console.log("training")
      let array1 = this.skymath.tensor_to_matrix(
        tensor.trainInputsTensor,
        tensor.trainInputsTensor.shape[0],
        this.getFirstLayerSize()
      );
      let array2 = this.skymath.tensor_to_matrix(
        tensor.trainOutputsTensor,
        tensor.trainOutputsTensor.shape[0],
        this.getLastLayerSize()
      );
      let obj = new Object()
      if (encoderDebug) {
        console.log("encoderDebug : ", array1)

        array1 = moduleInstance.encoderDebug(array1)
        console.log("encoderDebug transformed: ", array1)
      }
      obj.arrayInputs = array1
      obj.arrayOutputs = array2
      return JSON.stringify(obj)
    }
    else {
      return 0;
    }
  }

  async validate() {
    if (this.#testingData === undefined)
      this.#testingData = this.module.generateTestingData();

    const testingPredictedOutputsTensor = await this.#model.predict(
      this.#testingData.testingInputsTensor
    );
    const testingPredictedInputsMatrix = await this.skymath.tensor_to_matrix(
      this.#testingData.testingInputsTensor,
      this.#testingData.testingInputsTensor.shape[0],
      this.getFirstLayerSize()
    );
    const testingPredictedOutputsMatrix = await this.skymath.tensor_to_matrix(
      testingPredictedOutputsTensor,
      testingPredictedOutputsTensor.shape[0],
      this.getLastLayerSize()
    );
    const testingExpectedOutputsMatrix = await this.skymath.tensor_to_matrix(
      this.#testingData.testingExpectedOutputsTensor,
      this.#testingData.testingExpectedOutputsTensor.shape[0],
      this.getLastLayerSize()
    );

    window.testingPredictedOutputsMatrixBooleanized =
      this.skymath.normalized_to_boolean_matrix(testingPredictedOutputsMatrix);
    window.testingExpectedOutputsMatrixBooleanized =
      this.skymath.normalized_to_boolean_matrix(testingExpectedOutputsMatrix);

    const total_responses = window.testingExpectedOutputsMatrixBooleanized.length;
    let validatorGoodAnswerCount = 0;
    window.testingPredictedOutputsMatrixBooleanized.forEach(
      async (prediction, index) => {
        // console.log('prediction : '+ prediction);
        // console.log('expected : '+ window.testingExpectedOutputsMatrixBooleanized[index]);
        if (
          JSON.stringify(prediction) ===
          JSON.stringify(window.testingExpectedOutputsMatrixBooleanized[index])
        ) {
          validatorGoodAnswerCount++;
        } else {
          // console.log("titi",this.moduleConfig.patchTrainingMistakesWithTestingData)
          if (this.moduleConfig.patchTrainingMistakesWithTestingData) {
            const matrixInputs = await this.skymath.tensor_to_matrix(
              this.testingData.testingInputsTensor,
              this.testingData.testingInputsTensor.shape[0],
              this.getFirstLayerSize()
            );
            this.#trainingData.trainInputsTensor = this.tensorflow.concat(
              [
                this.trainingData.trainInputsTensor,
                this.tensorflow.tensor2d([matrixInputs[index]]),
              ],
              0
            );
            this.#trainingData.trainOutputsTensor = this.tensorflow.concat(
              [
                this.trainingData.trainOutputsTensor,
                this.tensorflow.tensor2d([
                  window.testingExpectedOutputsMatrixBooleanized[index],
                ]),
              ],
              0
            );
          }
          if (this.config.debug) {
            console.log({
              index: index,
              prediction: prediction,
              formattedPrediction: testingPredictedOutputsMatrix[index],
              expected: window.testingExpectedOutputsMatrixBooleanized[index],
              input: testingPredictedInputsMatrix[index],
            });
          }
        }
      }
    );

    return validatorGoodAnswerCount / total_responses;
  }

  async massPredict(inputs) {
    return this.module.moduleMassPredict(inputs);
  }

  async predict(inputs) {
    let encodedInputs = this.module.moduleEncoder(inputs);
    const encodedInputsTensor = this.tensorflow.tensor2d(
      encodedInputs,
      [1, 18]
    );
    const outputTensor = await this.#model.predict(encodedInputsTensor);
    const outputMatrix = await this.skymath.tensor_to_matrix(
      outputTensor,
      outputTensor.shape[0],
      this.getLastLayerSize()
    );
    // console.log(outputMatrix);
    return outputMatrix;
  }
}

module.exports = (moduleInstance, tensorflow) => {
  return new Skynet(moduleInstance, tensorflow);
};
