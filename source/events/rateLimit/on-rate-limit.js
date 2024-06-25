const c = require("chalk");

module.exports = (info) => {
  console.log(`\n` + "-".repeat(25) + `\n`);
  console.log(c.yellow("Dawn is being rate limited!"));
  console.log(c.cyan(`Route: ${info.route}`));
  console.log(c.cyan(`Limit: ${info.limit}`));
  console.log(c.cyan(`Time until Reset: ${info.timeout}`));
  console.log(`\n` + "-".repeat(25) + `\n`);
};
