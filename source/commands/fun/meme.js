const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a meme from Reddit"),

  run: async ({ interaction }) => {
    const res = await axios
      .get("https://meme-api.com/gimme")
      .catch(async (error) => {
        console.error(c.red(error));
        console.log(c.gray(error.stack));

        await interaction.reply({
          embeds: [embed.error],
        });
      });

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

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(nextMemeButton)],
    });
  },
  options: {
    category: "fun",
  },
};
