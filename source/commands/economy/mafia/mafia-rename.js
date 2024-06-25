const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const Economy = require("../../../models/Economy.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");
const containsProfanity = require("../../../func/profanity.js");

module.exports = async (interaction) => {
  try {
    const mafia = await Mafia.findOne({ owner: interaction.user.id });
    const allMafias = await Mafia.find();
    const inMafia = allMafias.some((mafia) =>
      mafia.members.some((member) => member.id === interaction.user.id),
    );
    const economy = await Economy.findOne({ userId: user.id });

    if (!mafia) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Only a Godfather may rename the Mafia.")
            .setColor("Red"),
        ],
      });

      return;
    }

    if (!inMafia) {
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

    const name = interaction.options.getString("name");

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

    if (!economy || economy.money < 1000) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You do not have enough :coin: to rename your mafia. Please make sure you withdraw 1000 :coin: before you attempt to rename your mafia.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    mafia.name = name;
    economy.money -= 1000;
    await mafia.save();
    await economy.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mafia Renamed")
          .setDescription(`Your mafia has been renamed to ${name}.`)
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
};
