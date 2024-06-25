const chalk = require("chalk");
const fs = require("fs").promises;
const path = require("path");

const defaultsPath = path.join(__dirname, "../config/_schemaDefaults.json");

let defaults;
async function loadDefaults() {
  try {
    const defaultsContent = await fs.readFile(defaultsPath, "utf8");
    defaults = JSON.parse(defaultsContent);
  } catch (err) {
    console.error(chalk.red("Error reading defaults file:"), err);
    console.log(chalk.gray(err.stack));
    process.exit(1);
  }
}

async function createEntrees(guild) {
  await loadDefaults();
  try {
    const query = { guildId: guild.id };

    let defaultsString = JSON.stringify(defaults);
    defaultsString = defaultsString.replace(/{guildID}/g, guild.id);

    const updatedDefaults = JSON.parse(defaultsString);

    const models = [
      {
        name: updatedDefaults.autorole.name,
        path: updatedDefaults.autorole.path,
        defaults: updatedDefaults.autorole.defaults,
      },
      {
        name: updatedDefaults.welcome.name,
        path: updatedDefaults.welcome.path,
        defaults: updatedDefaults.welcome.defaults,
      },
      {
        name: updatedDefaults.farewell.name,
        path: updatedDefaults.farewell.path,
        defaults: updatedDefaults.farewell.defaults,
      },
      {
        name: updatedDefaults.ticketSettings.name,
        path: updatedDefaults.ticketSettings.path,
        defaults: updatedDefaults.ticketSettings.defaults,
      },
      {
        name: updatedDefaults.suggestions.name,
        path: updatedDefaults.suggestions.path,
        defaults: updatedDefaults.suggestions.defaults,
      },
    ];

    const results = {};

    for (const model of models) {
      const Model = require(model.path);
      results[model.name] = await Model.findOne(query);
    }

    for (const model of models) {
      if (!results[model.name]) {
        const Model = require(model.path);
        const newDocument = new Model(model.defaults);
        await newDocument.save();
      }
    }
  } catch (error) {
    console.error(chalk.red("Error creating entrees:"), error);
    console.log(chalk.gray(error.stack));
  }
}

module.exports = createEntrees;
