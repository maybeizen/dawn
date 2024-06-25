const { EmbedBuilder } = require("discord.js");

const embeds = {
  errorEmbed: new EmbedBuilder()
    .setTitle("Error")
    .setDescription("An internal error occurred. Please try again later.")
    .setColor("Red"),
};

module.exports = embeds;
