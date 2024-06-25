const Mafia = require("../../../models/Mafia.js");
const Economy = require("../../../models/Economy.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");
const containsProfanity = require("../../../func/profanity.js");

module.exports = async (interaction) => {
  try {
    const name = interaction.options.getString("name");
    const user = interaction.user;

    const mafia = await Mafia.findOne({ owner: user.id });
    const allMafias = await Mafia.find();

    const inMafia = allMafias.some((m) =>
      m.members.some((member) => member.id === user.id),
    );

    const economy = await Economy.findOne({ userId: user.id });

    if (mafia || inMafia) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("You are already in a mafia!")
            .setColor("Red"),
        ],
      });

      return;
    }

    if (containsProfanity(name) === true) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Please choose a different name for your mafia.")
            .setColor("Red"),
        ],
      });

      return;
    }

    if (!economy || economy.money < 5000) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You do not have enough :coin: to create a mafia. Please make sure you withdraw 5000 :coin: before you attempt to create a mafia.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    const newMafia = new Mafia({
      owner: user.id,
      name: name,
      motto: "",
      cutPercentage: 80,
      bank: 1000,
      crimesCount: 0,
      members: [
        {
          name: user.username,
          id: user.id,
          standing: "Godfather",
        },
      ],
    });

    economy.money -= 5000;

    await economy.save();
    await newMafia.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mafia Created")
          .setDescription(
            "You have created a new crime syndicate. \n\nAs a Godfather, you can manage your Mafia all you like. Deposit and withdraw money, change cut percentages, rename the Mafia, etc.",
          )
          .setColor("#4d81dd")
          .setTimestamp()
          .addFields(
            {
              name: "Name",
              value: `${name}`,
              inline: true,
            },
            {
              name: `Bank`,
              value: `${newMafia.bank} :coin:`,
              inline: true,
            },
            {
              name: `Owner`,
              value: `${user}`,
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
