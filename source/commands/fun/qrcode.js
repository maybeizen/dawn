const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("Create a QR code with a seach query")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Where the QR Code will redirect to.")
        .setRequired(true),
    ),
  run: ({ interaction }) => {
    const query = interaction.options.getString("query");
    const rawUrl = `https://api.qrserver.com/v1/create-qr-code/?size=312x312&data=${query}`;
    const url = rawUrl.replace(/ /g, "+");
    const embed = new EmbedBuilder()
      .setTitle("QR Code")
      .setDescription(
        `${interaction.user} has created a QR Code for: \`${query}\``,
      )
      .setImage(url)
      .setColor("#4d81dd")
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
  options: {
    category: "fun",
  },
};
