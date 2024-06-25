const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const user = interaction.user;

    const mafiaOwned = await Mafia.findOne({ owner: user.id });

    const allMafias = await Mafia.find();
    const mafiaMembership = allMafias.find((mafia) =>
      mafia.members.some((member) => member.id === user.id),
    );

    if (!mafiaOwned) {
      if (mafiaMembership) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("Only the godfather can disband the mafia!")
              .setColor("Red"),
          ],
        });
        return;
      }

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

    await Mafia.deleteOne({ owner: user.id });
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Mafia Disbanded")
          .setDescription(
            "Your mafia has been disbanded.\n\nIf you did not withdraw the money from the mafia before you deleted it, it will be lost.",
          )
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
