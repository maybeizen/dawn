const Mafia = require("../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");
const rankOrder = [
  "Associate",
  "Soldier",
  "Caporegime",
  "Consigliere",
  "Underboss",
  "Godfather",
];

module.exports = async (interaction) => {
  try {
    const allMafias = await Mafia.find();
    const mafiaMembership = allMafias.find((mafia) =>
      mafia.members.some((member) => member.id === interaction.user.id),
    );

    if (!mafiaMembership) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("You are not in a mafia.")
            .setColor("Red"),
        ],
      });
      return;
    }

    const members = mafiaMembership.members;
    const sortedMembers = members.sort(
      (a, b) => rankOrder.indexOf(a.standing) - rankOrder.indexOf(b.standing),
    );
    let description = "";

    sortedMembers.forEach((member) => {
      description += `<@${member.id}> | ${member.standing}\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`${mafiaMembership.name}'s Members`)
      .setDescription(description)
      .setColor("#4d81dd")
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));

    await interaction.reply({
      embeds: [embeds.error],
    });
  }
};
