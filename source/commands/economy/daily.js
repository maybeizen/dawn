const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Economy = require("../../models/Economy.js");
const Cooldown = require("../../models/Cooldown.js");
const embeds = require("../../db/embeds.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward"),

  run: async ({ interaction }) => {
    await interaction.deferReply();

    try {
      const cooldown = await Cooldown.findOne({
        userId: interaction.user.id,
        type: "eco_daily",
      });

      const economy = await Economy.findOne({
        userId: interaction.user.id,
      });

      const now = Date.now();
      const cooldownAmount = 23.99 * 60 * 60 * 1000;
      const dailyAmount = 100;

      if (cooldown) {
        const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

        if (now < expirationTime) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooldown")
                .setDescription(
                  `You can claim your daily again <t:${Math.floor(
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
        { userId: interaction.user.id, type: "eco_daily" },
        { timestamp: new Date(now) },
        { upsert: true, new: true },
      );

      if (!economy) {
        const newEconomy = new Economy({
          userId: interaction.user.id,
          money: 0,
          bank: dailyAmount,
        });

        await newEconomy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Daily Claimed")
              .setDescription(
                `You claimed your daily reward of ${dailyAmount} :coin:.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });

        return;
      }

      economy.bank += dailyAmount;
      await economy.save();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Daily Claimed")
            .setDescription(
              `You claimed your daily reward of ${dailyAmount} :coin:.`,
            )
            .setColor("#4d81dd")
            .setTimestamp(),
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
    category: "economy",
  },
};
