const { EmbedBuilder } = require("discord.js");

const embeds = {
  error: new EmbedBuilder()
    .setTitle("Error")
    .setDescription("An internal error occurred. Please try again later.")
    .setColor("Red"),

  noPerms: new EmbedBuilder()
    .setTitle("Error")
    .setDescription("You do not have permission to use this command.")
    .setColor("Red"),

  runInGuild: new EmbedBuilder()
    .setTitle("Error")
    .setDescription("This command can only be used in a server.")
    .setColor("Red"),
};

module.exports = embeds;
