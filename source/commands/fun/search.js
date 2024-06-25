const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search Google with a specific query.")
    .addStringOption((option) =>
      option.setName("query").setDescription("What do you want to search?"),
    ),
  run: ({ interaction }) => {
    const query = interaction.options.getString("query");
    const rawURL = `https://www.google.com/search?q=${query}`;
    const url = rawURL.replace(/ /g, "+");
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} is searching...`)
      .setDescription(
        `${interaction.user} has searched for: \`${query}\`\n\n- URL: ${url}`,
      )
      .setColor("#4d81dd")
      .setFooter({
        text: "Powered by Google Seach",
        iconURl: "https://www.svgrepo.com/show/303108/google-icon-logo.svg",
      });

    interaction.reply({
      embeds: [embed],
    });
  },
  options: {
    category: "fun",
  },
};
