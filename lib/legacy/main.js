let nombreElem, epochNumber, debug, optimizerValue,activationFunction,fitCallbacks,model;
const globalConfig = require('./config.json');
if (globalConfig.enabled) {
    nombreElem = globalConfig.nombreElementsDatasetTest;
    epochNumber = globalConfig.epochNumber;
    debug = globalConfig.debug;
    optimizerValue = globalConfig.optimizerValue;
    activationFunction = globalConfig.activationFunction
    if (globalConfig.importModel) {
        async () => {
            model = await tf.loadLayersModel('localstorage://skynet');
        };
        if (model === undefined) {
            console.log("Importation error : undefined model")
            model = createModel();
        }
    } else {
        model = createModel();
    }
} else {
    nombreElem = 500;
    epochNumber = 70;
    debug = false;
    optimizerValue = 2;
    model = createModel();
}

// Create the model

const is_web = true;
const functions = require('./functions.js');
const init = require('./matrixesNumbers.js');
const utils = require('util');
if (!(is_web)) {
    const tf = require('@tensorflow/tfjs-node-gpu');
    const init = require(['./matrixesNumbers.js']);
}

const data = init.generateBaseData();
const dataset = [[],[]];
const train_images = [];
let train_inputs;
let trainOutputsTensor;
const validation_dataset = [[],[]];
const validation_data = init.generateBaseData();
const validation_images = [];
let validation_inputs;

for (let i = 0; i < nombreElem; i++) {
    const number = Math.floor(Math.random() * 10);
    dataset[1].push(number);
    // console.log("Type number = " + typeof(dataset[1][i]));
    const translation = Math.floor(Math.random() * 5);
    const orientation = Math.floor(Math.random() * 4);
    let temp_matrix = [];

    if (translation == 0) {
        temp_matrix = functions.translate_0(data[number],false);
    }
    if (translation == 1) {
        temp_matrix = functions.translate_180(data[number],false);
    }
    if (translation == 2) {
        temp_matrix = functions.translate_90(data[number],false);
    }
    if (translation == 3) {
        temp_matrix = functions.translate_270(data[number],false);
    }
    if (translation == 4) {
        temp_matrix = data[number];
    }

    if (orientation == 0) {
        dataset[0].push(temp_matrix);
    }
    if (orientation == 1) {
        dataset[0].push(functions.rotate90(temp_matrix,false));
    }
    if (orientation == 2) {
        dataset[0].push(functions.rotate180(temp_matrix,false));
    }
    if (orientation == 3) {
        dataset[0].push(functions.rotate270(temp_matrix,false));
    }
}

for (let i = 0; i < nombreElem; i++) {
    train_images.push(functions.matrix_5x5_to_1x25(dataset[0][i],false))
}
//console.log (train_images);
train_inputs = tf.tensor2d(train_images);
const train_outputs = [];
for (let i = 0; i < nombreElem; i++) {
    train_outputs.push(functions.dataset_training_predictions(dataset[1][i],false))
}

trainOutputsTensor = tf.tensor2d(train_outputs);

for (let i = 0; i < validation_data.length; i++) {
    for (let k=0; k<5; k++) {
        let temp_matrix = [];
        if (k===0) {
            temp_matrix = functions.translate_0(validation_data[i],false);
        }
        if (k===1) {
            temp_matrix = functions.translate_90(validation_data[i],false);
        }
        if (k===2) {
            temp_matrix = functions.translate_180(validation_data[i],false);
        }
        if (k===3) {
            temp_matrix = functions.translate_270(validation_data[i],false);
        }
        if (k===4) {
            temp_matrix = validation_data[i];
        }
        for (let j=0; j<4; j++) {
            if (j===0) {
                validation_dataset[0].push(temp_matrix);
                validation_dataset[1].push(i);
            }
            if (j===1) {
                validation_dataset[0].push(functions.rotate90(validation_data[i],false));
                validation_dataset[1].push(i);
            }
            if (j===2) {
                validation_dataset[0].push(functions.rotate180(validation_data[i],false));
                validation_dataset[1].push(i);
            }
            if (j===3) {
                validation_dataset[0].push(functions.rotate270(validation_data[i],false));
                validation_dataset[1].push(i);
            }
        }
    }
}

for (let i = 0; i < validation_dataset[0].length; i++) {
    validation_images.push(functions.matrix_5x5_to_1x25(validation_dataset[0][i],false))
}
validation_inputs = tf.tensor2d(validation_images);

console.log("TOTOTOTOTO",validation_images)

if (debug) {
    console.log("DEBUG VALID DATA INPUT = "+ utils.inspect(validation_images));
    console.log("DEBUG VALID DATA INPUT SIZE = "+ utils.inspect(validation_images.length));
}

//const datasetJSON = functions.convertToJSON(dataset);
//console.log(utils.inspect(datasetJSON).green);

function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a input layer
    model.add(tf.layers.dense({inputShape: [25], units: 25, useBias: true, activation: activationFunction}));

    // Add hidden layers
    //model.add(tf.layers.dense({units: 10, useBias: true, activation: activationFunction}));
    //model.add(tf.layers.dense({units: 2, useBias: true, activation: activationFunction}));
    //model.add(tf.layers.dense({units: 5, useBias: true, activation: activationFunction}));
    model.add(tf.layers.dense({units: 25, useBias: true, activation: activationFunction}));
    model.add(tf.layers.dense({units: 25, useBias: true, activation: activationFunction}));


    // Add an output layer
    model.add(tf.layers.dense({units: 10, useBias: true, activation: 'softmax'}));

    return model;
}

if (debug) {
    train_inputs.print();
    trainOutputsTensor.print();
    validation_inputs.print();
}

const sgd0pt = tf.train.sgd(optimizerValue);
const config = {
    optimizer : sgd0pt,
    loss : 'meanSquaredError',
    metrics: ['accuracy']
}
model.compile(config);

train().then(async (response) => {
    //console.log("history = ",response.history);
    if (is_web) {
        tfvis.visor();
        tfvis.show.modelSummary({name: 'Model Summary'}, model);
        tfvis.show.layer({name: 'Layer Summary'}, model);
        //const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const metrics = ['loss','acc'];
        const container = {
            name: 'Model Training',
            tab: "Model Training",
            styles: {
                height: '2000px'
            }}
        // fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
        tfvis.show.history(container, response, metrics);
    }
    console.log('Initial Training Complete. Starting Validation process');
    let validation_outputs = model.predict(validation_inputs);
    if (debug) {
        validation_outputs.print();
        console.log(validation_outputs);
    }
    const validation_data_output = await validation_outputs.data();
    const validation_data_output_matrix = functions.tensor_to_matrix(validation_data_output,validation_dataset[0].length,10);
    const booleanized_validation_data_output_matrix = functions.normalized_to_boolean_matrix(validation_data_output_matrix);
    const validation_expected_outputs = [];
    for (let i = 0; i < validation_dataset[0].length; i++) {
        validation_expected_outputs.push(functions.dataset_training_predictions(validation_dataset[1][i],debug))
    }
    const success_ratio = functions.training_validator(booleanized_validation_data_output_matrix,validation_expected_outputs,validation_data_output_matrix,validation_inputs,debug);
    console.log("Success rate of AI = ",success_ratio*100,"%");
    if (success_ratio > 0.95) {
        const saveResult = await model.save('localstorage://skynet');//await model.save('downloads://skynet-model');
    }
    // if (success_ratio === 1) {
    //     console.log("SKYNET STATUS : ONLINE");
    // }
    // validation_outputs.shape.values().forEach(output => {
    //     console.log(output);
    // });
});


function train() {
    const configTrain = {
        shuffle: true,
        epochs: epochNumber
    }
    // if (is_web) {
    //     configTrain.callbacks = fitCallbacks;
    // }
    return model.fit(train_inputs, trainOutputsTensor, configTrain).catch((error) => {console.log(error)});
    // for (let i=0; i<100; i++) {
    //     const response = await model.fit(train_inputs,trainOutputsTensor,configTrain).catch((error) => {console.log(error)} );
    //     console.log("Epoch = " + i + " : " + response.history.loss[0]);
    // }
}