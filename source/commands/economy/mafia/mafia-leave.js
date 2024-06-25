const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const mafia = await Mafia.findOne({ owner: interaction.user.id });
    const allMafias = await Mafia.find();
    const inMafia = allMafias.some((mafia) => {
      mafia.members.some((member) => member.id === interaction.user.id);
    });
    const mafiaMembership = allMafias.find((mafia) =>
      mafia.members.some((member) => member.id === interaction.user.id),
    );

    if (mafia) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You are not allowed to leave your own mafia! If you wish to disband it, it `/mafia dissolve`.",
            )
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

    mafiaMembership.members = mafiaMembership.members.filter(
      (member) => member.id !== interaction.user.id,
    );
    await mafiaMembership.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Left Mafia")
          .setDescription(`You stopped responding to ${mafiaMembership.name}.`)
          .setColor("#4d81dd")
          .setTimestamp(),
      ],
    });
  } catch (error) {}
};
