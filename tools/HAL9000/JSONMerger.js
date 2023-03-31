const requireDir = require("require-dir"); //Issues with browerify ?
const fs = require("fs");
const dir = "../../training/HAL9000/ScreenshotsDataset";
let obj;
const { chain } = require('stream-chain');

const { parser } = require('stream-json');
const { pick } = require('stream-json/filters/Pick');
const { ignore } = require('stream-json/filters/Ignore');
const { streamValues } = require('stream-json/streamers/StreamValues');
const { streamArray } = require('stream-json/streamers/StreamArray');
const { streamObject } = require('stream-json/streamers/StreamObject');


fs.readdir(dir, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }
  let count = 0
  files.forEach(function (file, index) {
    // let data = require("../../training/HAL9000/ScreenshotsDataset/" + file)
    // let data = fs.readFileSync(
    //   "../../training/HAL9000/ScreenshotsDataset/" + file,
    //   "utf8")
    // const pipeline = fs.createReadStream('"../../training/HAL9000/ScreenshotsDataset/" + file').pipe(parser());


    console.log(file)
    const pipeline = chain([
      fs.createReadStream("../../training/HAL9000/ScreenshotsDataset/" + file),
      parser(),
      pick({ filter: 'runId' }),
      streamArray(),
    ]);

    pipeline.on('data', (data) => {
      console.log(data)
      count += 1
      if (count % 100 === 0) {
        console.log(data)
      }
    });
    pipeline.on('end', () => {
      console.log("Final count = " + count);
    })



    // reader = fs.createReadStream("../../training/HAL9000/ScreenshotsDataset/" + file);
    // Read and display the file data on console
    // reader.on('data', function (chunk) {
    //   console.log(chunk.toString());
    // });
    // if (data === undefined) {
    //   console.log("error undefined")
    // } else {
    //   for (let i = 1; i < data.length; i++) {
    //     if (data[i - 1] == "}" && data[i] == "{") {
    //       console.log(" '}{' detected, fixing with ','...")
    //       data = data.slice(0, i) + "," + data.slice(i)
    //       let sentence = ""
    //       for (let j = i - 50; j < i + 50; j++) {
    //         sentence = sentence + data[j]
    //       }
    //       console.log("result : " + sentence)
    //     }
    //   }
    // };
  });
});
// A = [];
// B = [];

// if (A.length === 0) {
//   console.log(true);
// }
