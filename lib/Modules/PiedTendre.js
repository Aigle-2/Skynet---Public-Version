const Interface = require('../Framework/Interface');
const ModuleInterface = require('../Framework/ModuleInterface');
const util = require('util');
const colors = require('colors');

class PiedTendre {
    #debug = false;
    #skynet;
    #config;

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

    constructor() {
        Interface.checkImplements(this, ModuleInterface);
        this.#config = require('./PiedTendre.config.json');
        // console.log(util.inspect(this.config).blue);
    }


    saveDir() {
        return 'piedtendre';
    }

    classNames() {
        return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    }


    static #generateBaseData() {
        const m0 = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        const m1 = [
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0]
        ];

        const m2 = [
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0]
        ];

        const m3 = [
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ];

        const m4 = [
            [0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0]
        ];

        const m5 = [
            [0, 1, 1, 1, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ];

        const m6 = [
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ];

        const m7 = [
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0]
        ];

        const m8 = [
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ];

        const m9 = [
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ];

        return [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9];
    }

    generateTrainingData() {
        const nombreElem = this.config.nombreElementsDatasetTest;
        const data = PiedTendre.#generateBaseData();
        const dataset = [[], []];
        const train_images = [];
        let trainInputsTensor;
        for (let i = 0; i < nombreElem; i++) {
            const number = Math.floor(Math.random() * 10);
            dataset[1].push(number);
            // console.log("Type number = " + typeof(dataset[1][i]));
            const translation = Math.floor(Math.random() * 5);
            const orientation = Math.floor(Math.random() * 4);
            let temp_matrix = [];

            if (translation === 0) {
                temp_matrix = this.#translate_0(data[number]);
            }
            if (translation === 1) {
                temp_matrix = this.#translate_180(data[number]);
            }
            if (translation === 2) {
                temp_matrix = this.#translate_90(data[number]);
            }
            if (translation === 3) {
                temp_matrix = this.#translate_270(data[number]);
            }
            if (translation === 4) {
                temp_matrix = data[number];
            }

            if (orientation === 0) {
                dataset[0].push(temp_matrix);
            }
            if (orientation === 1) {
                dataset[0].push(this.#rotate90(temp_matrix));
            }
            if (orientation === 2) {
                dataset[0].push(this.#rotate180(temp_matrix));
            }
            if (orientation === 3) {
                dataset[0].push(this.#rotate270(temp_matrix));
            }
        }

        for (let i = 0; i < nombreElem; i++) {
            train_images.push(this.skymath.matrix_5x5_to_1x25(dataset[0][i]));
        }
        //console.log (train_images);
        trainInputsTensor = this.tensorflow.tensor2d(train_images);
        const train_outputs = [];
        for (let i = 0; i < nombreElem; i++) {
            train_outputs.push(this.#dataset_training_predictions(dataset[1][i]));
        }
        const trainOutputsTensor = this.tensorflow.tensor2d(train_outputs);

        return {
            trainInputsTensor: trainInputsTensor,
            trainOutputsTensor: trainOutputsTensor,
        };
    }

    generateTestingData() {
        const testing_dataset = [[], []];
        const testing_data = PiedTendre.#generateBaseData();
        const testing_images = [];
        const testing_expected_outputs = [];

        for (let i = 0; i < testing_data.length; i++) {
            for (let k = 0; k < 5; k++) {
                let temp_matrix = [];
                if (k === 0) {
                    temp_matrix = this.#translate_0(testing_data[i]);
                }
                if (k === 1) {
                    temp_matrix = this.#translate_90(testing_data[i]);
                }
                if (k === 2) {
                    temp_matrix = this.#translate_180(testing_data[i]);
                }
                if (k === 3) {
                    temp_matrix = this.#translate_270(testing_data[i]);
                }
                if (k === 4) {
                    temp_matrix = testing_data[i];
                }
                for (let j = 0; j < 4; j++) {
                    if (j === 0) {
                        testing_dataset[0].push(temp_matrix);
                        testing_dataset[1].push(i);
                    }
                    if (j === 1) {
                        testing_dataset[0].push(this.#rotate90(testing_data[i]));
                        testing_dataset[1].push(i);
                    }
                    if (j === 2) {
                        testing_dataset[0].push(this.#rotate180(testing_data[i]));
                        testing_dataset[1].push(i);
                    }
                    if (j === 3) {
                        testing_dataset[0].push(this.#rotate270(testing_data[i]));
                        testing_dataset[1].push(i);
                    }
                }
            }
        }
        for (let i = 0; i < testing_dataset[0].length; i++) {
            testing_images.push(this.skymath.matrix_5x5_to_1x25(testing_dataset[0][i]))
            testing_expected_outputs.push(this.#dataset_training_predictions(testing_dataset[1][i], false))
        }

        return {
            testingInputsTensor: this.tensorflow.tensor2d(testing_images),
            testingExpectedOutputsTensor: this.tensorflow.tensor2d(testing_expected_outputs)
        }
    }

    #dataset_training_predictions(prediction) {
        let newMatrix = [];
        // if (this.#debug) {
        //     console.log(utils.inspect(dataset).yellow);
        // }
        //console.log("Type number = " + typeof(prediction));
        if (this.#debug) {
            console.log("Prédiction = " + prediction
                + ' ' + typeof (prediction));
        }
        if (prediction === 0) {
            newMatrix = [
                1, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ];
        }
        else if (prediction === 1) {
            newMatrix = [
                0, 1, 0, 0, 0,
                0, 0, 0, 0, 0
            ];
        }
        else if (prediction === 2) {
            newMatrix = [
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0
            ];
        }
        else if (prediction === 3) {
            newMatrix = [
                0, 0, 0, 1, 0,
                0, 0, 0, 0, 0
            ];
        }
        else if (prediction === 4) {
            newMatrix = [
                0, 0, 0, 0, 1,
                0, 0, 0, 0, 0
            ];
        }
        else if (prediction === 5) {
            newMatrix = [
                0, 0, 0, 0, 0,
                1, 0, 0, 0, 0
            ];
        }
        else if (prediction === 6) {
            newMatrix = [
                0, 0, 0, 0, 0,
                0, 1, 0, 0, 0
            ];
        }
        else if (prediction === 7) {
            newMatrix = [
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0
            ];
        }
        else if (prediction === 8) {
            newMatrix = [
                0, 0, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
        }
        else if (prediction === 9) {
            newMatrix = [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 1
            ];
        }
        else {
            newMatrix = [
                "erreur"
            ];
            console.log("erreur prediction");
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #rotate90(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j] = matrix[j][(matrix.length - 1) - i];
            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #rotate270(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j] = matrix[(matrix.length - 1) - j][i];
            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #rotate180(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j] = matrix[(matrix.length - 1) - i][(matrix.length - 1) - j];
            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #translate_0(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (i === 0) {
                    newMatrix[i][j] = matrix[matrix.length - 1][j];
                } else {
                    newMatrix[i][j] = matrix[i - 1][j];
                }

            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #translate_180(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (i === matrix.length - 1) {
                    newMatrix[i][j] = matrix[0][j];
                } else {
                    newMatrix[i][j] = matrix[i + 1][j];
                }

            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #translate_90(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (j === matrix[0].length - 1) {
                    newMatrix[i][j] = matrix[i][0];
                } else {
                    newMatrix[i][j] = matrix[i][j + 1];
                }

            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    #translate_270(matrix) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(0);
            }
        }
        if (this.#debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (j === 0) {
                    newMatrix[i][j] = matrix[i][matrix[0].length - 1];
                } else {
                    newMatrix[i][j] = matrix[i][j - 1];
                }

            }
        }

        if (this.#debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }

        return newMatrix;
    }

    initialize() {
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
}

module.exports = new PiedTendre();