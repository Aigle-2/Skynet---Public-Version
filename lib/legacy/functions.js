//requirejs(['colors']);
require('colors');

const initialize_matrix = function(rows,columns) {
    const newMatrix = [];
    for (let i = 0; i < rows; i++) {
        if (newMatrix[i] === undefined) {
            newMatrix[i] = [];
        }
        for (let j = 0;j < columns ; j++) {
            newMatrix[i].push(0);
        }
    }
    return newMatrix;
}

module.exports = { 
    rotate90 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j]= matrix[j][(matrix.length - 1)-i];
            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    rotate270 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j]= matrix[(matrix.length - 1)-j][i];
            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    rotate180 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j]= matrix[(matrix.length - 1)-i][(matrix.length - 1)-j];
            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    translate_0 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (i===0) {
                    newMatrix[i][j]= matrix[matrix.length - 1][j];
                } else {
                    newMatrix[i][j]= matrix[i-1][j];
                }

            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    translate_180 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (i === matrix.length - 1) {
                    newMatrix[i][j]= matrix[0][j];
                } else {
                    newMatrix[i][j]= matrix[i+1][j];
                }

            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    translate_90 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (j === matrix[0].length - 1) {
                    newMatrix[i][j]= matrix[i][0];
                } else {
                    newMatrix[i][j]= matrix[i][j+1];
                }

            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    translate_270 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        for (let i = 0; i < matrix.length ; i++) {
            if (newMatrix[i] === undefined) {
                newMatrix[i] = [];
            }
            for (let j = 0; j < matrix[0].length ; j++) {
                newMatrix[i].push(0);
            }
        }
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (j === 0) {
                    newMatrix[i][j]= matrix[i][matrix[0].length - 1];
                } else {
                    newMatrix[i][j]= matrix[i][j-1];
                }

            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    

    convertToJSON : function(array) {
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {}
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
        }
    
        return objArray;
    },

    matrix_5x5_to_1x25 : function(matrix,debug) {
        const newMatrix = [];
        const utils = require('util');
        if (debug) {
            console.log(utils.inspect(matrix).yellow);
            console.log(utils.inspect(newMatrix).blue);
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix.push(matrix[i][j]);
            }
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    dataset_training_predictions : function(prediction,debug) {
        let newMatrix = [];
        const utils = require('util');
        // if (debug) {
        //     console.log(utils.inspect(dataset).yellow);
        // }
        //console.log("Type number = " + typeof(prediction));
        if (debug) {
            console.log("Prédiction = " + prediction
            + ' ' + typeof(prediction));
        }
        if (prediction == 0 ) {
            newMatrix = [
                1,0,0,0,0,
                0,0,0,0,0
            ];
        }
        else if (prediction == 1 ) {
            newMatrix = [
                0,1,0,0,0,
                0,0,0,0,0
            ];
        }
        else if (prediction == 2 ) {
            newMatrix = [
                0,0,1,0,0,
                0,0,0,0,0
            ];
        }
        else if (prediction == 3 ) {
            newMatrix = [
                0,0,0,1,0,
                0,0,0,0,0
            ];
        }
        else if (prediction == 4 ) {
            newMatrix = [
                0,0,0,0,1,
                0,0,0,0,0
            ];
        }
        else if (prediction == 5 ) {
            newMatrix = [
                0,0,0,0,0,
                1,0,0,0,0
            ];
        }
        else if (prediction == 6 ) {
            newMatrix = [
                0,0,0,0,0,
                0,1,0,0,0
            ];
        }
        else if (prediction == 7 ) {
            newMatrix = [
                0,0,0,0,0,
                0,0,1,0,0
            ];
        }
        else if (prediction == 8 ) {
            newMatrix = [
                0,0,0,0,0,
                0,0,0,1,0
            ];
        }
        else if (prediction == 9 ) {
            newMatrix = [
                0,0,0,0,0,
                0,0,0,0,1
            ];
        }
        else {
            newMatrix = [
                "erreur"
            ];
            console.log("erreur prediction");
        }

        if (debug) {
            console.log(utils.inspect(newMatrix).cyan);
        }
        
        return newMatrix;
    },

    normalized_to_boolean_matrix : function(matrix) {
        const rows = matrix.length;
        const columns = matrix[0].length;
        const newMatrix = initialize_matrix(rows,columns);
        for (let i = 0; i < rows ; i++) {
            let indexOfMaxValue = matrix[i].indexOf(Math.max(...matrix[i]));
            newMatrix[i][indexOfMaxValue] = 1;
        }
        return newMatrix;
    },

    tensor_to_matrix : function(tensor,rows,columns) {
        const newMatrix = initialize_matrix(rows,columns);
        for (let x=0; x<rows;x++) {
            for (let y=0; y<columns;y++) {
                newMatrix[x][y]= tensor[(x*columns)+y];
            }
        }
        return newMatrix;
    },

    training_validator : function(responses,expected_responses,prediction_probabilities,validation_inputs,debug) {
        let good_responses = 0;
        const total_responses = expected_responses.length;
        function iterate(array, index) {
            if (debug) {
                console.log("Index = ",index);
                console.log("array = ",array,"expected_responses",expected_responses[index]);
            }
            if (JSON.stringify(array) === JSON.stringify(expected_responses[index])) {
                //console.log("inside");
                good_responses = good_responses + 1;
            } else {
                console.log("Index ",index," : ERREUR PREDICTION");
                console.log("Index ",index," : ",prediction_probabilities[index]);
                console.log("Index ",index," : TEST",validation_inputs.shape[1]);
                console.log("Index ",index," : ",validation_inputs);
            }
        }
        responses.forEach(iterate);
        const success_rate = good_responses/total_responses;
        return success_rate;
    }

    // save_model : function(model,debug) {
    //     const saveResult = await model.save('downloads://mymodel');
    //     if (debug) {
    //         console.log(saveResult);
    //     }
    // }
}