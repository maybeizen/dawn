const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Economy = require("../../models/Economy.js");
const embeds = require("../../db/embeds.js");
const c = require("chalk");
const botOwnerId = "924513291806580736";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Manage a users money")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add money to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add money to")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of money to give")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set a users balance")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to set the balance of")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of money to set")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("take")
        .setDescription("Take money from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to take money from")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of money to take")
            .setRequired(true),
        ),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();

    if (interaction.user.id !== botOwnerId) {
      await interaction.editReply({
        embeds: [embeds.noPerms],
      });
    }

    try {
      const user = interaction.options.getUser("user");
      const command = interaction.options.getSubcommand();
      const economy = await Economy.findOne({ userId: user.id });

      if (command === "add") {
        const amount = interaction.options.getInteger("amount");

        if (!economy) {
          const newEconomy = new Economy({
            userId: user.id,
            money: amount,
            bank: 0,
          });

          await newEconomy.save();

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Money Added")
                .setDescription(
                  `You added ${amount} :coin: to ${user}'s balance.`,
                )
                .setColor("#4d81dd")
                .setTimestamp()
                .addFields({
                  name: "New Balance",
                  value: `${economy.money} :coin:`,
                }),
            ],
          });

          return;
        }

        economy.money += amount;
        await economy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Money Added")
              .setDescription(
                `You added ${amount} :coin: to ${user}'s balance.`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({
                name: "New Balance",
                value: `${economy.money} :coin:`,
              }),
          ],
        });
      } else if (command === "set") {
        const amount = interaction.options.getInteger("amount");

        if (!economy) {
          const newEconomy = new Economy({
            userId: user.id,
            money: amount,
            bank: 0,
          });

          await newEconomy.save();

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Money Set")
                .setDescription(
                  `You set ${user}'s balance to ${amount} :coin:.`,
                )
                .setColor("#4d81dd")
                .setTimestamp(),
            ],
          });

          return;
        }

        economy.money = amount;
        await economy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Money Set")
              .setDescription(`You set ${user}'s balance to ${amount} :coin:.`)
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "take") {
        const amount = interaction.options.getInteger("amount");

        if (!economy || economy.money < amount) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`That user doesn't have enough money.`)
                .setColor("Red"),
            ],
          });
          return;
        }

        economy.money -= amount;
        await economy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Money Taken")
              .setDescription(
                `You took ${amount} :coin: from ${user}'s balance.`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({
                name: "New Balance",
                value: `${economy.money} :coin:`,
              }),
          ],
        });
      }
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
