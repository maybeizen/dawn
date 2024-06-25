const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { randomProfession, randomNumber } = require("../../func/random.js");
const embeds = require("../../db/embeds.js");
const Economy = require("../../models/Economy.js");
const Cooldown = require("../../models/Cooldown.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work for extra money"),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const amount = randomNumber(80, 200);
    const chanceToPayTaxes = randomNumber(0, 100);
    const amountTakenIfTaxes = randomNumber(40, 80);
    const profession = randomProfession();

    try {
      const cooldown = await Cooldown.findOne({
        userId: interaction.user.id,
        type: "eco_work",
      });

      const economy = await Economy.findOne({
        userId: interaction.user.id,
      });

      const cooldownAmount = 60 * 60 * 1000; // 1 hour
      const now = Date.now();

      if (cooldown) {
        const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

        if (now < expirationTime) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooldown")
                .setDescription(
                  `You can work again <t:${Math.floor(
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
        { userId: interaction.user.id, type: "eco_work" },
        { timestamp: new Date(now) },
        { upsert: true, new: true },
      );

      if (!economy) {
        const newEconomy = new Economy({
          userId: interaction.user.id,
          money: 0,
          bank: 0,
        });

        await newEconomy.save();
      }

      if (chanceToPayTaxes <= 30) {
        const newAmount = amount - amountTakenIfTaxes;

        economy.money += newAmount;
        await economy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`You worked as a ${profession}!`)
              .setDescription(
                `And you brought home ${newAmount} :coin: after paying taxes.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
        return;
      }

      economy.money += amount;
      await economy.save();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`You worked as a ${profession}!`)
            .setDescription(`And you brought home ${amount} :coin:.`)
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
