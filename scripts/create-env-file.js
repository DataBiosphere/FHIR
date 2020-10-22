const fs = require("fs");

const outFlags = ["-o", "--out"];

let outFile = ".env";

const args = process.argv.slice(2);

const processedArgs = args.reduce((accum, arg, i) => {
  if (outFlags.includes(arg)) {
    if (!args[i + 1]) {
      throw new Error("Must specify a directory");
    } else {
      outFile = args[i + 1];
    }
  } else if (!outFlags.includes(args[i - 1])) {
    accum.push(arg);
  }
  return accum;
}, []);

fs.writeFileSync(outFile, processedArgs.join("\n"));
