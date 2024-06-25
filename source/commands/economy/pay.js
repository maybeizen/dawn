const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Economy = require("../../models/Economy.js");
const embeds = require("../../db/embeds.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay another user some money")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to pay")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of money to pay")
        .setRequired(true),
    ),
  run: async ({ interaction }) => {
    await interaction.deferReply();

    try {
      const amount = interaction.options.getInteger("amount");
      const user = interaction.options.getUser("user");

      const authorEconomy = await Economy.findOne({
        userId: interaction.user.id,
      });

      const targetEconomy = await Economy.findOne({
        userId: user.id,
      });

      if (user.bot) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("You can't pay a bot!")
              .setColor("Red"),
          ],
        });

        return;
      }

      if (user.id === interaction.user.id) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("You can't pay yourself!")
              .setColor("Red"),
          ],
        });

        return;
      }

      if (!user) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("The user you specified was not found!")
              .setColor("Red"),
          ],
        });

        return;
      }

      if (!authorEconomy || amount > authorEconomy.money) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`You don't have enough money to pay ${user}!`)
              .setColor("Red")
              .addFields(
                {
                  name: "Balance",
                  value: `${authorEconomy.money} :coin:`,
                  inline: true,
                },
                {
                  name: "You still need",
                  value: `${amount - authorEconomy.money} :coin:`,
                  inline: true,
                },
              ),
          ],
        });

        return;
      }

      if (!targetEconomy) {
        const newTargetEconomy = new Economy({
          userId: user.id,
          money: amount,
          bank: 0,
        });
        await newTargetEconomy.save();

        authorEconomy.money -= amount;
        await authorEconomy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("User Paid")
              .setDescription(
                `You have successfully paid ${user} ${amount} :coin:`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({
                name: "New Balance",
                value: `${authorEconomy.money} :coin:`,
              }),
          ],
        });

        return;
      }

      authorEconomy.money -= amount;
      await authorEconomy.save();

      targetEconomy.money += amount;
      await targetEconomy.save();

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("User Paid")
            .setDescription(
              `You have successfully paid ${user} ${amount} :coin:`,
            )
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields({
              name: "New Balance",
              value: `${authorEconomy.money} :coin:`,
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
