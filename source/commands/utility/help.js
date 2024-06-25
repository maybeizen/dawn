const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const c = require("chalk");
const emojis = require("../../config/_emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a list of commands for Dawn"),

  run: async ({ interaction }) => {
    const embed = new EmbedBuilder()
      .setTitle("Command List")
      .setDescription(
        "To view a categories commands, select a category from the drop down menu.",
      )
      .setColor("#4d81dd")
      .setTimestamp()
      .addFields(
        {
          name: `${emojis.settings.emoji} Utility`,
          value: "Commands for different purposes.",
        },
        {
          name: `${emojis.shield.emoji} Moderation`,
          value: "Commands related to moderating the server.",
        },
        {
          name: `${emojis.coins.emoji} Economy`,
          value: "Commands for making and managing money.",
        },
        {
          name: `${emojis.tent.emoji} Fun`,
          value: "Commands for fun.",
        },
        {
          name: `${emojis.user.emoji} User Commands`,
          value: "Commands related to the user or members.",
        },
        {
          name: `${emojis.database.emoji} ${interaction.guild.name} Data`,
          value: "View data for your server",
        },
      );

    const options = [
      { label: "Utility", value: "utility", emoji: emojis.settings.emoji },
      { label: "Moderation", value: "moderation", emoji: emojis.shield.emoji },
      { label: "Economy", value: "economy", emoji: emojis.coins.emoji },
      { label: "Fun", value: "fun", emoji: emojis.tent.emoji },
      { label: "User", value: "user", emoji: emojis.user.emoji },
      {
        label: "Server Data",
        value: "server-data",
        emoji: emojis.database.emoji,
      },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help-menu")
      .setPlaceholder("Choose a category")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        options.map((option) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(option.label)
            .setValue(option.value)
            .setEmoji(option.emoji),
        ),
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
  options: {
    category: "utility",
  },
};
