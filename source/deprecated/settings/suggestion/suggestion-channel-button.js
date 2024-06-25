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

  if (interaction.customId === "suggestions-channel-button") {
    const suggestion = await Suggestion.findOne({
      guildId: interaction.guild.id,
    });

    const modal = new ModalBuilder()
      .setCustomId(`suggestion-channel-${interaction.user.id}`)
      .setTitle("Suggestion Channel");

    const input = new TextInputBuilder()
      .setCustomId("suggestion-channel-input")
      .setLabel("Channel")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Input a channel by name or ID")
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);

    modal.addComponents(row);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === `suggestion-channel-${i.user.id}`;

    const modalInteraction = await interaction.awaitModalSubmit({
      filter,
      time: 45000,
    });

    const value = await modalInteraction.fields.getTextInputValue(
      "suggestion-channel-input",
    );

    let newChannel = interaction.guild.channels.cache.get(value);

    if (!newChannel) {
      newChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name === value,
      );

      console.log(newChannel);
    }

    suggestion.channelId = newChannel.id;
    await suggestion.save();

    await modalInteraction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Suggestion Channel")
          .setDescription(
            `You have updated the server-wide suggestion channel.`,
          )
          .setColor("#4d81dd")
          .setTimestamp()
          .addFields({
            name: "Channel",
            value: `${newChannel}`,
          }),
      ],
      ephemeral: true,
    });
  }
};
