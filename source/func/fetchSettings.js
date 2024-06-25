const c = require("chalk");

async function fetchSettings(interaction) {
  try {
    const Suggestion = require("../models/Suggestion.js");
    const Autorole = require("../models/Autorole.js");
    const Welcome = require("../models/Welcome.js");
    const Farewell = require("../models/Farewell.js");
    const TicketSettings = require("../models/Ticket-Settings.js");

    const query = {
      guildId: interaction.guild.id,
    };

    const suggestion = await Suggestion.findOne(query);
    const autorole = await Autorole.findOne(query);
    const welcome = await Welcome.findOne(query);
    const farewell = await Farewell.findOne(query);
    const ticketSettings = await TicketSettings.findOne(query);

    const settings = {
      suggestion,
      autorole,
      welcome,
      farewell,
      ticketSettings,
    };

    if (!suggestion || !autorole || !welcome || !farewell || !ticketSettings) {
      await interaction.reply(
        "Failed to fetch database data! This is usually because you have not set up the feature you are trying to configure.",
        { ephemeral: true },
      );

      return null;
    }

    return settings;
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
}

module.exports = fetchSettings;
