const {
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

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "ticket-staff-ping-button") {
    const ticketSettings = await TicketSettings.findOne({
      guildId: interaction.guild.id,
    });

    const embed = new EmbedBuilder()
      .setTitle(`Ticket Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server ticket sytem.
          
You can currently change the following:
- Ticket Panel Message
- Ticket Message (Message inside ticket channel)
- Creation Message
- Staff Pinging
### PANEL MESSAGE
> When configuring the panel message, you can use the following placeholders:
- \`[SERVER]\` - Show server name
### TICKET MESSAGE
> You are able to use these placeholders:
- \`[USER]\` - Mention the author of the ticket
- \`[SERVER]\` - Show server name
- \`[TICKET]\` - Mention the ticket channel
- \`[ID]\` - Show the user ID
### TICKET SETTINGS
- \`Staff Pinging\` - Enabled/Disabled
### OTHER
- With any settings configuration, you can enter the value "default" and it will reset the messages to the default ones.
### NOTICE
> Use the placeholders above **as shown**. If you do not, your message could break and not display properly.`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    let staffPingButtonStyle = ticketSettings.staffPings
      ? ButtonStyle.Danger
      : ButtonStyle.Success;
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket-panel-message-button")
        .setLabel("Panel Message")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-message-button")
        .setLabel("Ticket Message")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ticket-staff-ping-button")
        .setLabel(
          `${ticketSettings.staffPings ? "Disabled" : "Enabled"} (Pings)`,
        )
        .setStyle(staffPingButtonStyle),
      new ButtonBuilder()
        .setCustomId("ticket-creation-message-button")
        .setLabel("Creation Message")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    if (!ticketSettings) {
      const ticketSettings = new TicketSettings({
        guildId: interaction.guild.id,
        ticketMessage: defaultTicketMessage,
        ticketPanelMessage: defaultTicketPanelMessage,
        staffPings: true,
      });

      await ticketSettings.save();

      await interaction.update({
        embeds: [embed],
        components: [row],
        ephermeral: true,
      });
    } else {
      ticketSettings.staffPings = !ticketSettings.staffPings;
      await ticketSettings.save();

      await interaction.update({
        embeds: [embed],
        components: [row],
        ephermeral: true,
      });
    }
  }
};
