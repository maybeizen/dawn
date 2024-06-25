const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const user = interaction.options.getUser("user");

    const mafia = await Mafia.findOne({ owner: interaction.user.id });
    const allMafias = await Mafia.find();
    const mafiaMembership = allMafias.find((mafia) =>
      mafia.members.some((member) => member.id === interaction.user.id),
    );

    if (!mafiaMembership) {
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

    const userStanding = mafiaMembership.members.find(
      (member) => member.id === interaction.user.id,
    ).standing;

    if (userStanding !== "Godfather") {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You are not allowed to invite people to the mafia! You must be a Godfather or an Underboss.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    if (mafia.pendingInvites.some((invite) => invite.user === user.id)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("This user has already been invited!")
            .setColor("Red"),
        ],
      });

      return;
    }

    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 1);

    mafia.pendingInvites.push({
      user: user.id,
      inviter: interaction.user.id,
      expiresIn: expireTime,
    });

    await mafia.save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Invite Sent")
          .setDescription(
            `An invite to ${
              mafia.name
            } has been sent to ${user}. It will expire in <t:${Math.floor(
              expireTime.getTime() / 1000,
            )}:R>.`,
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
