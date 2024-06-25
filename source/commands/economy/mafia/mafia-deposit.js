const Mafia = require("../../../models/Mafia.js");
const Economy = require("../../../models/Economy.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const user = interaction.user;
    const allMafias = await Mafia.find();
    const mafiaMembership = allMafias.find((mafia) =>
      mafia.members.some((member) => member.id === user.id),
    );
    const economy = await Economy.findOne({ userId: user.id });
    const amount = interaction.options.getInteger("amount");

    if (!mafiaMembership) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("You are not in a mafia!")
            .setColor("Red"),
        ],
      });

      return;
    }

    if (!economy || amount > economy.money) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You do not have enough money. Make sure you withdraw the amount you would like to deposit to the mafia.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    mafiaMembership.bank += amount;
    economy.money -= amount;
    await economy.save();
    await mafiaMembership.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mafia Deposit")
          .setDescription(
            `You deposited ${amount} :coin: into your mafia's bank!`,
          )
          .setColor("#4d81dd")
          .setTimestamp()
          .addFields(
            {
              name: "Your Balance",
              value: `${economy.money} :coin:`,
              inline: true,
            },
            {
              name: "Mafia's Bank",
              value: `${mafiaMembership.bank} :coin:`,
              inline: true,
            },
          ),
      ],
    });
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));

    await interaction.reply({
      embeds: [embeds.error],
    });
  }
};
