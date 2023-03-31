const util = require("util");
const now = require("performance-now");
require("colors");
const { Command } = require("commander");
const program = new Command();
program.version("0.0.1");
program
  .option("-g, --gpu", "CPU mode", false)
  .option("-v, --verbose", "Verbose mode", false)
  .option("-t, --train", "Train mode", false)
  .option("-s, --save", "Save model output")
  .option("-l, --load <name>", "Load a saved model")
  .option("-i, --inputs <name>", "inputs")
  .option("-e, --export <name>", "Export model from localstorage to disk")
  .requiredOption("-m, --module <name>", "Module to run");

program.parse(process.argv);
const options = program.opts();
if (options.verbose)
  console.log(util.inspect(options).blue);

let tf;
if (!options.gpu) tf = require("@tensorflow/tfjs-node");
else tf = require("@tensorflow/tfjs-node-gpu");

async function start() {
  const moduleInstance = require("./lib/Modules/" + options.module);
  const skynet = require("./lib/Framework/Skynet")(moduleInstance, tf);
  skynet.initialize(options.verbose);

  await skynet.load(options.load);

  if (options.train) {
    if (options.verbose)
      console.log("Begin training...".yellow);
    skynet.train(options.save).then((successRatio) => {
      if (options.verbose) {
        console.log(
            ("Taux de réussite final : " + successRatio * 100 + "%").green
        );
      }
    });
  } else if (!(options.inputs === undefined)) {
    const startedAt = now();
    const fs = require('fs/promises');
    const inputFileStats = await fs.stat(options.inputs).catch(e => {});
    if (inputFileStats === undefined) {
      options.inputs = Buffer.from(options.inputs, "base64");
      options.inputs = JSON.parse(options.inputs.toString("utf8"));
      let results = await skynet.predict(options.inputs);
      const time = now() - startedAt;
      console.log(JSON.stringify({output: results, time: time.toFixed(3)}))
    } else  {
      const inputs = require(options.inputs);
      const results = await skynet.massPredict(inputs);
      const time = now() - startedAt;
      console.log(JSON.stringify({output: results, time: time.toFixed(3)}))
    }
    // décodage
    // console.log(util.inspect(options.inputs))
  } else if (!(options.export === undefined)) {
    skynet.exportModel(options.export);
  }

}

try {
  start();

} catch (error) {
  console.log(error.stack.red);
}
