const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const c = require("chalk");
const Cooldown = require("../../models/Cooldown.js");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report an issue/bug with Dawn")
    .addStringOption((option) =>
      option
        .setName("issue")
        .setDescription("The issue to report")
        .setRequired(true),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const reportChannel = client.channels.cache.get("1189761905200472074");
    const report = interaction.options.getString("issue");
    const cooldownAmount = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();

    if (!reportChannel) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "The report channel was not found! Please join the [Dawn Support Server](https://discord.gg/ChcAt2tsNU) and create a ticket!",
            )
            .setColor("Red"),
        ],
      });
      return;
    }

    try {
      const cooldown = await Cooldown.findOne({
        userId: interaction.user.id,
        type: "report",
      });

      const now = Date.now();
      const cooldownAmount = 10 * 60 * 1000;

      if (cooldown) {
        const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

        if (now < expirationTime) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooldown")
                .setDescription(
                  `You can submit another report <t:${Math.floor(
                    expirationTime / 1000,
                  )}:R>.`,
                )
                .setColor("Red"),
            ],
          });
          return;
        }
      }

      await Cooldown.findOneAndUpdate(
        { userId: interaction.user.id, type: "report" },
        { timestamp: new Date(now) },
        { upsert: true, new: true },
      );

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Report Submitted")
            .setDescription(
              "You reported an issue to the Dawn developer team. We will review it as soon as possible.",
            )
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
      });

      await reportChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("New Report")
            .setDescription(
              `A new report has been submitted by ${interaction.user}`,
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "Report",
              value: report,
            }),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
      await interaction.editReply({
        embeds: [embeds.error],
      });
    }
  },
  options: {
    category: "utility",
  },
};
