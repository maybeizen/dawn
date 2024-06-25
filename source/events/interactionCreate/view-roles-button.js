const { EmbedBuilder } = require("discord.js");
const c = require("chalk");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "view-roles-button") {
    const guild = interaction.guild;
    const roles = guild.roles.cache.map((role) => `<@&${role.id}>`).join("\n ");

    const embed = new EmbedBuilder()
      .setTitle(`Roles for ${guild.name}`)
      .setColor("#4d81dd")
      .setDescription(roles);
    await interaction.reply({
      embeds: [embed],
      components: [],
      ephemeral: true,
    });
  }
};
