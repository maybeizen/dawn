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

  if (interaction.customId === "ticket-panel-message-button") {
    const ticketSettings = await TicketSettings.findOne({
      guildId: interaction.guild.id,
    });

    const settings = await fetchSettings(interaction);

    const modal = new ModalBuilder()
      .setCustomId(`ticket-panel-message-${interaction.user.id}`)
      .setTitle("Ticket Panel Message");

    const input = new TextInputBuilder()
      .setCustomId("ticket-panel-message-input")
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Write a message. You have 120 sec")
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);

    modal.addComponents(row);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === `ticket-panel-message-${i.user.id}`;

    const modalInteraction = await interaction.awaitModalSubmit({
      filter,
      time: 120000,
    });

    const newMessage = modalInteraction.fields.getTextInputValue(
      "ticket-panel-message-input",
    );

    console.log(newMessage);

    if (!ticketSettings) {
      const newTicketSettings = new TicketSettings({
        ticketPanelMessage: newMessage,
        ticketMessage: defaultTicketMessage,
        guildId: interaction.guild.id,
        staffPings: false,
      });

      await newTicketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket panel message has been updated successfully!",
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
    } else if (newMessage === "default") {
      ticketSettings.ticketPanelMessage = defaultTicketPanelMessage;
      await ticketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket panel message has been reset to the default, because you specificed default!",
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "New Message",
              value: defaultTicketPanelMessage,
            }),
        ],
        ephemeral: true,
      });
    } else {
      ticketSettings.ticketPanelMessage = newMessage;
      await ticketSettings.save();

      await modalInteraction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket Settings")
            .setDescription(
              "Your ticket panel message has been updated successfully!",
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
