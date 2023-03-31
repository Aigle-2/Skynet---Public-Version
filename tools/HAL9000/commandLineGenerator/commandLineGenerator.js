// lire fichier json en dur
// require
// convertir json en string (JSON.stringify)
// encoder en base 64 :  
// let buffer = new Bufffer(stringEncodé)
// buffer.toString('base64')
// console.log(node skynet.js arguments) => va générer


// décodage
// string = new Buffer(data,'base64')
// buffer.toString('utf8')
// JSON.parse(string)

const file1 = "./commandLineGenerator_failRun.json";
const file2 = "./commandLineGenerator_runToCompare.json";
function generator(file1, file2) {
    file1 = require(file1);
    file2 = require(file2);
    let inputs = {
        failRun: file1,
        runToCompare: file2
    }
    inputs = JSON.stringify(inputs);
    inputs = Buffer.from(inputs);
    inputs = inputs.toString('base64');
    console.log("node skynet.js -l 20210716-165130 -i" + inputs + " -m Hal9000")
};
generator(file1,file2)
//node commandLineGenerator.js