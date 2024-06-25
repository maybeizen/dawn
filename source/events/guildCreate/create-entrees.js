const c = require("chalk");
const Settings = require("../../models/Settings.js");
const replaceGuildId = require("../../func/replace.js");

module.exports = async (guild) => {
  try {
    const defaultsFile = require("../../db/defaults.js");

    const defaults = replaceGuildId(defaultsFile, guild.id);

    const settings = await Settings.findOne({ guildId: guild.id });

    if (!settings) {
      const newSettings = new Settings({
        guildId: guild.id,
        tickets: defaults.tickets.defaults,
        welcome: defaults.welcome.defaults,
        autorole: defaults.autorole.defaults,
        farewell: defaults.farewell.defaults,
        economy: defaults.economy.defaults,
        suggestion: defaults.suggestion.defaults,
      });

      await newSettings.save();
    } else return;

    console.log(c.cyan("Database entrees created for server " + guild.name));
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
};
