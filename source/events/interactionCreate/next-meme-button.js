const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }

  if (interaction.customId === "next-meme-button") {
    const res = await axios.get("https://meme-api.com/gimme");

    const embed = new EmbedBuilder()
      .setTitle(`${res.data.title}`)
      .setImage(`${res.data.url}`)
      .setColor("#4d81dd")
      .setFooter({ text: `r/${res.data.subreddit}` })
      .setTimestamp();

    const nextMemeButton = new ButtonBuilder()
      .setCustomId("next-meme-button")
      .setLabel("Next Meme?")
      .setEmoji("😂")
      .setStyle(ButtonStyle.Primary);

    await interaction.update({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(nextMemeButton)],
    });
  }
};
