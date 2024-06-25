const c = require("chalk");

module.exports = (info) => {
  console.log("\n" + "=".repeat(25) + "\n");
  console.error(c.yellow(`Reported new warning: ${info}`));
  console.log("\n" + "=".repeat(25) + "\n");
};
