require("colors");
const util = require("util");

class Skymath {
  #skynet;
  #debugMode = false;

  get skynet() {
    return this.#skynet;
  }

  get tensorflow() {
    return this.#skynet.tensorflow;
  }

  set debugMode(value) {
    this.#debugMode = value;
  }

  constructor(skynet) {
    this.#skynet = skynet;
  }

  initialize_matrix(rows, columns) {
    const newMatrix = [];
    for (let i = 0; i < rows; i++) {
      if (newMatrix[i] === undefined) {
        newMatrix[i] = [];
      }
      for (let j = 0; j < columns; j++) {
        newMatrix[i].push(0);
      }
    }
    return newMatrix;
  }

  matrix_5x5_to_1x25(matrix) {
    const newMatrix = [];
    if (this.#debugMode) {
      console.log(util.inspect(matrix).yellow);
      console.log(util.inspect(newMatrix).blue);
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        newMatrix.push(matrix[i][j]);
      }
    }

    if (this.#debugMode) {
      console.log(util.inspect(newMatrix).cyan);
    }

    return newMatrix;
  }

  normalized_to_boolean_matrix(matrix) {
    const rows = matrix.length;
    const columns = matrix[0].length;
    const newMatrix = this.initialize_matrix(rows, columns);
    for (let i = 0; i < rows; i++) {
      let indexOfMaxValue = matrix[i].indexOf(Math.max(...matrix[i]));
      newMatrix[i][indexOfMaxValue] = 1;
    }
    return newMatrix;
  }

  tensor_to_matrix(tensor, rows, columns) {
    const data = tensor.dataSync();
    const newMatrix = this.initialize_matrix(rows, columns);
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        newMatrix[x][y] = data[x * columns + y];
      }
    }
    return newMatrix;
  }

  matrix_to_tensor(matrix, shape) {
    let tensor;
    if (shape === undefined) {
      tensor = this.tensorflow.tensor(matrix);
    } else {
      tensor = this.tensorflow.tensor(matrix, shape);
    }
    return tensor;
  }

  stackAddElementDeleteFirst(stack, element) {
    const newStack = [];
    for (let x = 1; x < stack.length; x++) {
      newStack[x - 1] = stack[x];
    }
    newStack.push(element);
    return newStack;
  }

  isStackElementsValuesAverageEqual(stack) {
    let { firstStack, secondStack } = this.divideStackInTwo(stack);
    const halfStack1Average =
      firstStack.reduce((a, b) => a + b, 0) / Math.floor(stack.length / 2);
    const halfStack2Average =
      secondStack.reduce((a, b) => a + b, 0) / Math.floor(stack.length / 2);
    if (halfStack1Average === halfStack2Average) {
      return true;
    } else {
      return false;
    }
  }

  isStackElementsValuesAverageInferiorValue(stack, value) {
    let { firstStack, secondStack } = this.divideStackInTwo(stack);
    const halfStack1Average =
      firstStack.reduce((a, b) => a + b, 0) / Math.floor(stack.length / 2);
    const halfStack2Average =
      secondStack.reduce((a, b) => a + b, 0) / Math.floor(stack.length / 2);
    if (halfStack1Average > halfStack2Average + value) {
      return true;
    } else {
      return false;
    }
  }

  divideStackInTwo(stack) {
    const halfStack1 = [];
    const halfStack2 = [];
    let halfStack1Total = 0;
    let halfStack2Total = 0;
    let halfStacklength = Math.floor(stack.length / 2);
    let indexModifier = 0;
    if (this.isOdd(stack.length)) {
      indexModifier = 1;
    }
    for (let x = 0; x < halfStacklength; x++) {
      halfStack1[x] = stack[x];
      halfStack1Total = halfStack1Total + stack[x];
      halfStack2[x] = stack[x + halfStacklength + indexModifier];
      halfStack2Total =
        halfStack2Total + stack[x + halfStacklength + indexModifier];
    }
    return {
      firstStack: halfStack1,
      secondStack: halfStack2,
    };
  }

  isOdd(num) {
    if (num % 2 === 0) return false;
    else return true;
  }

  convertToJSON(array) {
    const objArray = [];
    let key;
    for (let i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (let k = 0; k < array[0].length && k < array[i].length; k++) {
        key = array[0][k];
        objArray[i - 1][key] = array[i][k];
      }
    }
    return objArray;
  }

  stringNumbersToArray(string, separator) {
    return string.split(separator).map((x) => +x);
  }

  arrayToPlotData(arrayInputs, arrayAnswers) {
    let newArray = [];
    for (let t = 0; t < arrayAnswers[0].length; t++) {
      newArray.push([]);
    }
    let arrayAnswersConverted = this.convertOutputDataTo1D(arrayAnswers)
    for (let i = 0; i < arrayInputs.length; i++) {
      const x = arrayInputs[i][0];
      const y = arrayInputs[i][1];
      const answer = arrayAnswersConverted[i]
      newArray[answer].push({
        x: x,
        y: y,
      });
    }
    return newArray;
  }

  convertOutputDataTo1D(array) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(Number(array[i].indexOf(1)));
    }
    // console.log(array)
    // console.log(newArray)
    return newArray;
  }
}

module.exports = (skynet) => {
  return new Skymath(skynet);
};
