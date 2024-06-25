const {
  ModalBuilder,
  EmbedBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const c = require("chalk");
const Ticket = require("../../../models/Ticket.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "close-ticket-button") {
    try {
      const ticket = await Ticket.findOne({
        channelId: interaction.channel.id,
      });

      if (ticket) {
        await Ticket.deleteOne({
          channelId: interaction.channel.id,
        });
      }

      const guild = interaction.guild;
      const ticketChannel = interaction.channel;

      await interaction.reply("Closing Support ticket...");

      await pause(1200);
      await guild.channels.delete(ticketChannel);
    } catch (error) {
      console.log(c.red(error));
      console.log(c.gray(error.stack));
    }
  }
};

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
