const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const TicketSettings = require("../../../../models/Ticket-Settings.js");
const {
  defaultTicketMessage,
  defaultTicketPanelMessage,
} = require("../../../../config/_messages_.json");

const fetchSettings = require("../../../../func/fetchSettings.js");

/**
 * @param {Object} param0
 * @param {param import("discord.js").ChatInputCommandInteraction} param0.interaction
 */

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "ticket-message-button") {
    const ticketSettings = await TicketSettings.findOne({
      guildId: interaction.guild.id,
    });

    const modal = new ModalBuilder()
      .setCustomId(`ticket-message-${interaction.user.id}`)
      .setTitle("Ticket Message");

    const input = new TextInputBuilder()
      .setCustomId("ticket-message-input")
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Write a message. You have 120 sec")
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);

    modal.addComponents(row);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === `ticket-message-${i.user.id}`;

    const modalInteraction = await interaction.awaitModalSubmit({
      filter,
      time: 120000,
    });

    const newMessage = modalInteraction.fields.getTextInputValue(
      "ticket-message-input",
    );

    if (!ticketSettings) {
      const ticketSettings = new TicketSettings({
        guildId: interaction.guild.id,
        ticketPanelMessage: defaultTicketPanelMessage,
        ticketMessage: newMessage,
      });
      await ticketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket message has been updated successfully.",
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "Ticket Message",
              value: newMessage,
            }),
        ],
        ephemeral: true,
      });
    } else if (newMessage === "default") {
      ticketSettings.ticketMessage = defaultTicketMessage;
      await ticketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket message has been changed to the default, because you specified 'default'.",
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "Ticket Message",
              value: defaultTicketMessage,
            }),
        ],
        ephemeral: true,
      });
    } else {
      ticketSettings.ticketMessage = newMessage;
      await ticketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket message has been updated successfully!",
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "New Message",
              value: newMessage,
            }),
        ],
        ephemeral: true,
      });
    }
  }
};
