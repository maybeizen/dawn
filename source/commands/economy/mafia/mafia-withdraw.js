const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const Economy = require("../../../models/Economy.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const mafia = await Mafia.findOne({ owner: interaction.user.id });
    const economy = await Economy.findOne({ userId: interaction.user.id });

    const amount = interaction.options.getInteger("amount");

    if (!mafia) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Only a Godfather may withdraw from the Mafia.")
            .setColor("Red"),
        ],
      });

      return;
    }

    if (amount > mafia.bank) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You do not have that much money in your mafia's bank.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    if (!economy) {
      const newEconomy = new Economy({
        userId: interaction.user.id,
        money: 0,
        bank: amount,
      });

      mafia.bank -= amount;

      await mafia.save();
      await newEconomy.save();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Mafia Withdraw")
            .setDescription(
              `You withdrew ${amount} :coin: from your mafia's bank!`,
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "Bank",
              value: `${newEconomy.bank} :coin:`,
            }),
        ],
      });

      return;
    }

    economy.bank += amount;
    mafia.bank -= amount;

    await economy.save();
    await mafia.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mafia Withdraw")
          .setDescription(
            `You withdrew ${amount} :coin: from your mafia's bank!`,
          )
          .setColor("#4d81dd")
          .setTimestamp()
          .addFields({
            name: "Bank",
            value: `${economy.bank} :coin:`,
          }),
      ],
    });
  } catch (error) {
    console.error(c.red(error));
    console.error(c.gray(error.stack));

    await interaction.reply({
      embeds: [embeds.error],
    });
  }
};
