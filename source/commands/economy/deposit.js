const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Economy = require("../../models/Economy.js");
const embeds = require("../../db/embeds.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit money into your bank")

    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of money to deposit")
        .setRequired(true),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const amount = interaction.options.getInteger("amount");

    try {
      const economy = await Economy.findOne({
        userId: interaction.user.id,
      });

      if (!economy || economy.money < amount) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "You are trying to deposit more money than you have!",
              )
              .setColor("Red")
              .addFields(
                {
                  name: "Balance",
                  value: `${economy.money} :coin:`,
                  inline: true,
                },
                {
                  name: "You still need",
                  value: `${amount - economy.money} :coin:`,
                  inline: true,
                },
              ),
          ],
        });
        return;
      }

      economy.money -= amount;
      economy.bank += amount;

      await economy.save();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Money Deposited")
            .setDescription(`You deposited ${amount} :coin: into your bank.`)
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "New Bank Balance",
              value: `${economy.bank} :coin:`,
              inline: true,
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
    category: "economy",
  },
};
