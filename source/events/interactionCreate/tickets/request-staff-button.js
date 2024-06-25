const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const TicketSettings = require("../../../models/Ticket-Settings.js");
const Cooldown = require("../../../models/Cooldown.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "request-staff-button") {
    const ticketSettings = await TicketSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!ticketSettings) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "The staff system for this server has no been setup yet.",
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      });

      return;
    }

    if (ticketSettings.staffPings === false) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Staff pings are not enabled for this server.")
            .setColor("Red"),
        ],
        ephemeral: true,
      });

      return;
    }

    if (!ticketSettings.staffRoleId) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("There is no staff role available to ping.")
            .setColor("Red"),
        ],
        ephemeral: true,
      });

      return;
    }

    const cooldown = await Cooldown.findOne({
      userId: interaction.user.id,
      type: "request-staff-ping",
    });

    const now = Date.now();
    const cooldownAmount = 45 * 60 * 1000;

    if (cooldown) {
      const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

      if (now < expirationTime) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Cooldown")
              .setDescription(
                `You are allowed to request staff again <t:${Math.floor(
                  expirationTime / 1000,
                )}:R>.`,
              )
              .setColor("Red"),
          ],
          ephemeral: true,
        });
        return;
      }
    }

    await Cooldown.findOneAndUpdate(
      { userId: interaction.user.id, type: "request-staff-ping" },
      { timestamp: new Date(now) },
      { upsert: true, new: true },
    );

    await cooldown.save();

    await interaction.reply({
      content: `<@&${ticketSettings.staffRoleId}>`,
      embeds: [
        new EmbedBuilder()
          .setTitle("Staff Request")
          .setDescription(`${interaction.user} is requesting staff support...`)
          .setColor("#4d81dd")
          .setTimestamp(),
      ],
    });
  }
};
