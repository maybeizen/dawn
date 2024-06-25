const mongoose = require("mongoose");
const c = require("chalk");
const uri = process.env.mongodb_uri;
const start = Date.now();

(async () => {
  try {
    await mongoose.connect(uri);
    const time = Date.now() - start;

    console.log(
      c.green(`MongoDB Connection Established... `) + c.cyan(`[${time} ms]`),
    );
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
})();
