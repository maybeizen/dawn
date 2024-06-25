const { EmbedBuilder } = require("discord.js");
const c = require("chalk");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "view-channels-button") {
    const guild = interaction.guild;
    const channels = guild.channels.cache
      .map((channel) => `<#${channel.id}>`)
      .join("\n ");

    const embed = new EmbedBuilder()
      .setTitle(`Channels for ${guild.name}`)
      .setColor("#4d81dd")
      .setDescription(channels);
    await interaction.reply({
      embeds: [embed],
      components: [],
      ephemeral: true,
    });
  }
};
