const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const { errorEmbed } = require("../../../config/_embeds.js");
const fetchSettings = require("../../../func/fetchSettings.js");
const TicketSettings = require("../../../models/Ticket-Settings.js");
const Suggestion = require("../../../models/Suggestion.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const query = {
    guildId: interaction.guild.id,
  };

  const ticketSettings = await TicketSettings.findOne(query);
  const suggestion = await Suggestion.findOne(query);

  if (interaction.customId === "ticket-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Ticket Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server ticket sytem.
          
You can currently change the following:
- Ticket Panel Message
- Ticket Message (Message inside ticket channel)
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
      ? ButtonStyle.Success
      : ButtonStyle.Danger;
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
          `${ticketSettings.staffPings ? "Enabled" : "Disabled"} (Pings)`,
        )
        .setStyle(staffPingButtonStyle),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else if (interaction.customId === "welcome-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Welcome Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server welcome system.
        
You can currently edit the following:
- Enabled/Disabled
- Channel
- Test Welcome (Based on other settings, like channel.)
### ENABLED/DISABLED
> This will turn on or turn off the welcome system, if you would like to.
### CHANNEL
> Configure the channel where welcome messages are sent. You are able to input a channel by the following:
- Name
- ID
- Mention`,
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("welcome-toggle-button")
        .setLabel("Toggle")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("welcome-channel-button")
        .setLabel("Channel")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("welcome-test-button")
        .setLabel("Test Welcome")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else if (interaction.customId === "farewell-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Farewell Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server farewell system.

You can currently edit the following:
- Enabled/Disabled
- Channel
- Test (Based on other settings, like channel.)
### ENABLED/DISABLED
> This will turn on or turn off the farewell system, if you would like to.
### CHANNEL
> Configure the channel where farewell messages are sent. You are able to input a channel by the following:
- Name
- ID
- Mention`,
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("farewell-toggle-button")
        .setLabel("Enabled")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("farewell-channel-button")
        .setLabel("Channel")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("farewell-test-button")
        .setLabel("Test")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else if (interaction.customId === "autorole-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Autorole Settings`)
      .setDescription(
        `
Here is where you can edit all of the settings to do with the server autorole system.

You can currently edit the following:
- Role
- Enabled/Disabled
### ROLE
> Configure the role that will be given to the autorole. You are able to input a role by the following:
- Name
- ID
- Mention
### ENABLED/DISABLED
> This will turn on or turn off the autorole system, if you would like to.`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("autorole-role-button")
        .setLabel("Role")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("autorole-toggle-button")
        .setLabel("Toggle")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else if (interaction.customId === "suggestions-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Suggestions Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server suggestions system.
        
You can currently edit the following:
- Enabled/Disabled
- Channel
### ENABLED/DISABLED
> This will turn on or turn off the suggestions system, if you would like to.
### CHANNEL
> Configure the channel where suggestion messages are sent. You are able to input a channel by the following:
- Name
- ID
- Mention`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    let suggestionButtonStyle = suggestion.enabled
      ? ButtonStyle.Success
      : ButtonStyle.Danger;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggestions-channel-button")
        .setLabel("Channel")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("suggestions-toggle-button")
        .setLabel(`${suggestion.enabled ? "Enabled" : "Disabled"}`)
        .setStyle(suggestionButtonStyle),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  } else if (interaction.customId === "staff-settings-button") {
    const embed = new EmbedBuilder()
      .setTitle(`Staff Settings`)
      .setDescription(
        `Here is where you can edit all of the settings to do with the server staff system.
        
You can currently edit the following:
- Role
### ROLE
> Configure the server-wide staff role that Dawn uses as a base for the staff system. You are able to input a role by the following:
- Name
- ID
- Mention`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("staff-role-button")
        .setLabel("Role")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  }
};
