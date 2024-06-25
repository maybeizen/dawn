const c = require("chalk");

module.exports = (error) => {
  console.log("\n" + "=".repeat(25) + "\n");
  console.error(c.red(error));
  console.log(c.gray(error.stack));
  console.log("\n" + "=".repeat(25) + "\n");
};
