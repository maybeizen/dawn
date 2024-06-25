const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const Suggestion = require("../../../../models/Suggestion.js");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "suggestions-toggle-button") {
    const suggestion = await Suggestion.findOne({
      guildId: interaction.guild.id,
    });

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
      ? ButtonStyle.Danger
      : ButtonStyle.Success;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggestions-channel-button")
        .setLabel("Channel")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("suggestions-toggle-button")
        .setLabel(`${suggestion.enabled ? "Disabled" : "Enabled"}`)
        .setStyle(suggestionButtonStyle),
    );

    if (!suggestion) {
      const newSuggestion = new Suggestion({
        guildId: interaction.guild.id,
        enabled: true,
      });

      await newSuggestion.save();

      await interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    } else {
      suggestion.enabled = !suggestion.enabled;
      await suggestion.save();

      await interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    }
  }
};
