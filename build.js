var fs = require("fs");
var browserify = require("browserify");

browserify("./web/skynet.js")
  .transform("babelify", {
    presets: ["@babel/preset-env"],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-private-methods",
    ],
  })
  .bundle()
  .pipe(fs.createWriteStream("./web/bundle.js"));
