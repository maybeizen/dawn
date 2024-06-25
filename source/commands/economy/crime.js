const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Economy = require("../../models/Economy");
const Cooldown = require("../../models/Cooldown");
const Mafia = require("../../models/Mafia");
const embeds = require("../../db/embeds.js");
const c = require("chalk");
const { randomCrime, randomNumber } = require("../../func/random.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Commit crimes for fake money."),

  run: async ({ interaction }) => {
    try {
      let economy = await Economy.findOne({
        userId: interaction.user.id,
      });

      let cooldown = await Cooldown.findOne({
        userId: interaction.user.id,
        type: "eco_crime",
      });

      const allMafias = await Mafia.find();
      const inMafia = allMafias.some((mafia) =>
        mafia.members.some((member) => member.id === interaction.user.id),
      );
      const mafiaMembership = allMafias.find((mafia) =>
        mafia.members.some((member) => member.id === interaction.user.id),
      );

      const now = Date.now();
      let cooldownAmount = 1800000; // 30 mins
      const cooldownAmountIfFailed = 7200000; // 2 hrs

      const chanceToFail = randomNumber(0, 100);
      const chanceToLoseMoney = randomNumber(0, 100);
      const amountToRemoveIfFailed = randomNumber(50, 120);
      const amountToRemoveIfLoseMoney = randomNumber(30, 74);
      const amount = randomNumber(75, 250);
      const crime = randomCrime();
      const mafiaPercent = 80;

      if (cooldown) {
        const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

        if (now < expirationTime) {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooldown")
                .setDescription(
                  `Hey! Wait for the heat to die down! You can commit another crime <t:${Math.floor(
                    expirationTime / 1000,
                  )}:R>.`,
                )
                .setColor("Red"),
            ],
          });
          return;
        }
      }

      if (chanceToFail <= 20) {
        const totalMoney = economy.money + economy.bank;

        if (totalMoney < amountToRemoveIfFailed) {
          cooldownAmount = cooldownAmountIfFailed;
        }
      }

      await Cooldown.findOneAndUpdate(
        { userId: interaction.user.id, type: "eco_crime" },
        { timestamp: new Date(now) },
        { upsert: true, new: true },
      );

      if (!economy) {
        economy = new Economy({
          userId: interaction.user.id,
          money: 0,
          bank: 0,
        });

        await economy.save();
      }

      if (chanceToFail <= 20) {
        const totalMoney = economy.money + economy.bank;

        if (totalMoney < amountToRemoveIfFailed) {
          economy.money = 0;
          economy.bank = 0;

          await economy.save();

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`You tried to ${crime}!`)
                .setDescription(
                  `And you failed terribly and the police caught you, but you couldn't afford the fine so you have been placed in cooldown for 2 hours!`,
                )
                .setColor("#4d81dd")
                .setTimestamp(),
            ],
          });

          return;
        }

        if (economy.money >= amountToRemoveIfFailed) {
          economy.money -= amountToRemoveIfFailed;
        } else {
          const remainingMoneyToDeduct = amountToRemoveIfFailed - economy.money;
          economy.money = 0;
          economy.bank -= remainingMoneyToDeduct;
        }

        await economy.save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`You tried to ${crime}!`)
              .setDescription(
                `And you failed terribly and the police caught you! You were charged ${amountToRemoveIfFailed} :coin:`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
        return;
      }

      let finalAmount = amount;

      if (chanceToLoseMoney <= 30) {
        finalAmount -= amountToRemoveIfLoseMoney;
      }

      let mafiaAmount = 0;

      if (mafiaMembership) {
        mafiaAmount = Math.ceil((finalAmount * mafiaPercent) / 100);
        finalAmount -= mafiaAmount;

        await Mafia.findOneAndUpdate(
          { _id: mafiaMembership._id },
          { $inc: { amount: mafiaAmount } },
        );
      }

      economy.money += finalAmount;

      await economy.save();

      let description = `And successfully stole ${amount} :coin:.`;
      if (chanceToLoseMoney <= 30) {
        description += ` You lost ${amountToRemoveIfLoseMoney} :coin: during your escape.`;
      }
      if (mafiaMembership) {
        description += `\n\nBecause you are in a mafia, ${mafiaAmount} :coin: goes to it.`;
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`You ${crime}!`)
            .setDescription(description)
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.reply({
        embeds: [embeds.error],
      });
    }
  },
  options: {
    category: "economy",
  },
};
