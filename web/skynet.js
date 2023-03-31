const util = require("util");
require("colors");

// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Save Model";
const br = document.createElement("br");
const stopButton = document.createElement("button");
stopButton.innerHTML = "Stop Model";


// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);
body.appendChild(br);
body.appendChild(stopButton);


// 3. Add event handler
button.addEventListener("click", function () {
  window.saveOutputLoop = true;
});

// 3. Add event handler
stopButton.addEventListener("click", function () {
  window.stopOutputLoop = window.stopOutputLoop === false;
});

(async () => {
  const tfvis = window.tfvis;
  try {
    const moduleInstance = require("../lib/Modules/HAL9000"); //HAL9000
    const skynet = require("../lib/Framework/Skynet")(
      moduleInstance,
      window.tf
    );
    skynet.useWebStorage();
    // skynet.useFileStorage();
    // await skynet.load("20210716-165130"); //20210716-165130 20210722-161405
    skynet.initialize(2);
    // await skynet.exportModel("20210716-165130")
    if (skynet.config.saveEncoding) {
      var moment = require("moment-timezone");
      await skynet.generateData()
      const filenameTraining = "Encoded_training_data_" + (moment().tz("Europe/Paris").format("YYYYMMDD-HHmmss")) + ".json";
      const file = new Blob(
        [skynet.saveEncoding(skynet.trainingData, "training")],
        { type: 'application/json' }
      );
      const linkElement = document.createElement("a");
      const fileURL = URL.createObjectURL(file);
      linkElement.setAttribute('href', fileURL);
      linkElement.setAttribute('download', filenameTraining)
      document.body.appendChild(linkElement);
      linkElement.click();

      const filenameTesting = "Encoded_testing_data_" + (moment().tz("Europe/Paris").format("YYYYMMDD-HHmmss")) + ".json";
      const file2 = new Blob(
        [skynet.saveEncoding(skynet.testingData, "testing")],
        { type: 'application/json' }
      );
      const linkElement2 = document.createElement("a");
      const fileURL2 = URL.createObjectURL(file2);
      linkElement2.setAttribute('href', fileURL2);
      linkElement2.setAttribute('download', filenameTesting)
      document.body.appendChild(linkElement2);
      linkElement2.click();

      console.log("Pre-Encoding finished")
      // console.log(file2.text())
    }
    skynet.train(false).then((successRatio) => {
      tfvis.visor();
      tfvis.show.modelSummary({ name: "Model Summary" }, skynet.model);
      tfvis.show.layer({ name: "Layer Summary" }, skynet.model);
      const metrics = ["loss", "val_loss", "acc", "val_acc"];
      // const metrics = ['loss','acc'];
      const series = [];
      const valuesAcc = [];
      const valuesLoss = [];
      const numberOfCurvesToPrint = 5;
      let arrayOfIndexToPrint = [];
      if (skynet.trainingHistory.length > numberOfCurvesToPrint) {
        const step = skynet.trainingHistory.length / numberOfCurvesToPrint;
        for (let i = 0; i < numberOfCurvesToPrint * step; i = i + step) {
          if (!arrayOfIndexToPrint.includes(Math.round(i))) {
            arrayOfIndexToPrint.push(Math.round(i));
          }
        }
        if (!arrayOfIndexToPrint.includes(skynet.trainingHistory.length - 1)) {
          arrayOfIndexToPrint.push(skynet.trainingHistory.length - 1);
        }
      } else {
        for (let i = 0; i < numberOfCurvesToPrint; i++) {
          arrayOfIndexToPrint.push(i);
        }
      }
      // fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
      skynet.trainingHistory.forEach((element, index) => {
        // const container = {
        //     name: 'Model Training',
        //     tab: "Model Training "+ (index + 1),
        //     styles: {
        //         // height: height + 'px'
        //         height: '2000px'
        //     }}
        // console.log(element);

        const iterationValuesAcc = [];
        const iterationValuesLoss = [];
        for (let i = 0; i < element.history.acc.length; i++) {
          const y = element.history.val_acc[i];
          const y2 = element.history.val_loss[i];
          const x = element.epoch[i];
          iterationValuesAcc.push({
            x: x,
            y: y,
          });
          iterationValuesLoss.push({
            x: x,
            y: y2,
          });
        }
        if (arrayOfIndexToPrint.includes(index)) {
          series.push("Iteration " + (index + 1));
          valuesAcc.push(iterationValuesAcc);
          valuesLoss.push(iterationValuesLoss);
        }
        const container = { name: "Iteration " + index, tab: "Model Training" };
        tfvis.show.history(container, element, metrics);
      });

      const styles = {
        width: 1000,
        height: 300,
      };

      const dataAcc = {
        values: valuesAcc,
        series,
      };
      const surfaceAcc = {
        name: "Validation Accuracy",
        tab: "Iteration Comparison",
        styles: styles,
      };
      tfvis.render.linechart(surfaceAcc, dataAcc, {
        width: 800,
        xLabel: "Epochs",
        yLabel: "Accuracy",
        zoomToFit: true,
      });
      const dataLoss = {
        values: valuesLoss,
        series,
      };
      const surfaceLoss = {
        name: "Validation Loss",
        tab: "Iteration Comparison",
        styles: styles,
      };
      tfvis.render.linechart(surfaceLoss, dataLoss, {
        width: 800,
        xLabel: "Epochs",
        yLabel: "Loss",
        zoomToFit: true,
      });
      const surfaceTSNE = {
        name: "Input Data t-SNE",
        tab: "Evaluation",
        styles: styles,
      };
      let valuesTSNE = skynet.skymath.arrayToPlotData(
        TSNEGeneration(
          skynet.skymath.tensor_to_matrix(
            skynet.trainingData.trainInputsTensor,
            skynet.trainingData.trainInputsTensor.shape[0],
            skynet.getFirstLayerSize()
          )
        ),
        skynet.skymath.tensor_to_matrix(
          skynet.trainingData.trainOutputsTensor,
          skynet.trainingData.trainOutputsTensor.shape[0],
          skynet.getLastLayerSize()
        )
      );
      const seriesTSNE = moduleInstance.classNames();
      let dataTSNE = {
        values: valuesTSNE,
        series: seriesTSNE,
      };
      // console.log(dataTSNE);
      tfvis.render.scatterplot(surfaceTSNE, dataTSNE, {
        width: 800,
        xLabel: "X",
        yLabel: "Y",
        // xAxisDomain: [-20,20],
        // yAxisDomain: [-20,20],
        zoomToFit: true,
      });
      showConfusion(moduleInstance, skynet);
      showAccuracy(moduleInstance, skynet);

      tfvis.visor().toggleFullScreen();
      console.log(
        ("Taux de réussite final : " + successRatio * 100 + "%").green
      );
    });
  } catch (error) {
    console.log(error.stack.red);
  }
})();

async function showConfusion(moduleInstance, skynet) {
  // const [preds, labels] = doPrediction();
  const confusionMatrix = await tfvis.metrics.confusionMatrix(
    tf.tensor1d(
      skynet.skymath.convertOutputDataTo1D(
        window.testingExpectedOutputsMatrixBooleanized
      )
    ),
    tf.tensor1d(
      skynet.skymath.convertOutputDataTo1D(
        window.testingPredictedOutputsMatrixBooleanized
      )
    )
  );
  // console.log(convertOutputDataTo1D(window.testingPredictedOutputsMatrixBooleanized));
  // console.log(convertOutputDataTo1D(window.testingExpectedOutputsMatrixBooleanized));
  const container = {
    name: "Confusion Matrix",
    tab: "Evaluation",
  };
  const classNames = moduleInstance.classNames();
  tfvis.render.confusionMatrix(container, {
    values: confusionMatrix,
    tickLabels: classNames,
  });
  // labels.dispose();
}

async function showAccuracy(moduleInstance, skynet) {
  const classAccuracy = await tfvis.metrics.perClassAccuracy(
    tf.tensor1d(
      skynet.skymath.convertOutputDataTo1D(
        window.testingExpectedOutputsMatrixBooleanized
      )
    ),
    tf.tensor1d(
      skynet.skymath.convertOutputDataTo1D(
        window.testingPredictedOutputsMatrixBooleanized
      )
    )
  );
  const classNames = moduleInstance.classNames();
  const container = {
    name: "Accuracy",
    tab: "Evaluation",
  };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);
}

function TSNEGeneration(data) {
  // console.log(data);
  let opt = {};
  opt.epsilon = 10; // epsilon is learning rate (10 = default)
  opt.perplexity = 100; // roughly how many neighbors each point influences (30 = default)
  opt.dim = 2; // dimensionality of the embedding (2 = default)

  let tsne = new tsnejs.tSNE(opt); // create a tSNE instance

  // initialize data. Here we have 3 points and some example pairwise dissimilarities
  tsne.initDataRaw(data);
  for (let k = 0; k < 500; k++) {
    tsne.step(); // every time you call this, solution gets better
  }

  let Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  // console.log(Y);
  return Y;
}
// function doPrediction(testDataSize = 500) {
//   const testData = data.nextTestBatch(testDataSize);
//   const testxs = testData.xs.reshape([testDataSize, 28, 28, 1]);
//   const labels = testData.labels.argMax([-1]);
//   const preds = model.predict(testxs).argMax([-1]);
//   testxs.dispose();
//   return [preds, labels];
// }
