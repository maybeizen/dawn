const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Economy = require("../../models/Economy");
const c = require("chalk");
const embeds = require("../../db/embeds.js");
const { randomNumber } = require("../../func/random.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Panhandle for some extra money"),
  run: async ({ interaction }) => {
    try {
      const economy = await Economy.findOne({
        userId: interaction.user.id,
      });

      const amount = randomNumber(15, 50);
      const chance = randomNumber(0, 100);

      if (chance <= 40) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("You Panhandled")
              .setDescription(
                `But, everyone decided to ignore you and you ended the day with nothing!`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });

        return;
      }

      if (!economy) {
        const newEconomy = new Economy({
          userId: interaction.user.id,
          money: amount,
          bank: 0,
        });

        await newEconomy.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("You Panhandled")
              .setDescription(
                `And it was profitable! You earned ${amount} :coin:!`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });

        return;
      }

      economy.money += amount;

      await economy.save();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("You Panhandled")
            .setDescription(
              `And it was profitable! You earned ${amount} :coin:!`,
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
