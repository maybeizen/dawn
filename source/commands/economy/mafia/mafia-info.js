const Mafia = require("../../../models/Mafia.js");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

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

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("mafia-button-members")
        .setLabel("Members")
        .setStyle(ButtonStyle.Secondary),
    );

    const embed = new EmbedBuilder()
      .setTitle(`${mafiaMembership.name}'s Info`)
      .setDescription(`Here is some information about the mafia you are in.`)
      .setColor("#4d81dd")
      .setTimestamp()
      .addFields(
        {
          name: "Name",
          value: `${mafiaMembership.name}`,
          inline: true,
        },
        {
          name: "Motto",
          value: `${mafiaMembership.motto}` || "No Motto",
          inline: true,
        },
        {
          name: "Owner",
          value: `<@${mafiaMembership.owner}>`,
          inline: true,
        },
        {
          name: "Bank",
          value: `${mafiaMembership.bank} :coin:`,
          inline: true,
        },
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));

    await interaction.reply({
      embeds: [embeds.error],
    });
  }
};
