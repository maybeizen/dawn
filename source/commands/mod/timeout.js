const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const durationList = {
  300000: "5 Minutes",
  1800000: "30 Minutes",
  3600000: "1 Hour",
  21600000: "6 Hours",
  86400000: "1 Day",
  259200000: "3 Days",
  604800000: "7 Days",
  1209600000: "14 Days",
  2414880000: "28 Days",
};
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Temporarily mute a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("How long to time the user out for.")
        .setRequired(true)
        .addChoices(
          {
            name: "5 Minutes",
            value: "300000",
          },
          {
            name: "30 Minutes",
            value: "1800000",
          },
          {
            name: "1 Hour",
            value: "3600000",
          },
          {
            name: "6 Hours",
            value: "21600000",
          },
          {
            name: "1 Day",
            value: "86400000",
          },
          {
            name: "3 Days",
            value: "259200000",
          },
          {
            name: "7 Days",
            value: "604800000",
          },
          {
            name: "14 Days",
            value: "1209600000",
          },
          {
            name: "28 Days",
            value: "2414880000",
          },
        ),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for timing out"),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({});

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(runInGuild)
            .setColor("Red"),
        ],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers,
      )
    ) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(noPerms)
            .setColor("Red"),
        ],
      });
      return;
    }

    const bot = interaction.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Timeout Members`",
            )
            .setColor("Red"),
        ],
      });
    }

    const user = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No Reason Provided";
    const duration = interaction.options.getString("duration");
    const durationInReadableValues = durationList[duration];
    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (!user) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("The provided user was not found")
            .setColor("Red"),
        ],
      });
      return;
    }

    if (user.id === interaction.guild.ownerId) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You are not allowed to timeout that user, they are the owner of this server.",
            )
            .setColor("Red"),
        ],
      });
      return;
    }

    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You are not allowed to timeout that user, they are an administrator.",
            )
            .setColor("Red"),
        ],
      });
      return;
    }

    if (targetUserRolePosition >= authorUserRolePosition) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "You are not allowed to timeout that user, they have a higher role than you!.",
            )
            .setColor("Red"),
        ],
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I are not allowed to timeout that user, they have a higher role than me!.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    try {
      await user.timeout(Number(duration));

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Muted Member`)
            .setDescription(`${interaction.user} has timed out by ${user}`)
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields(
              {
                name: "Reason",
                value: reason,
                inline: true,
              },
              {
                name: "Duration",
                value: durationInReadableValues,
                inline: true,
              },
            ),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.editReply({
        embeds: [errorEmbed],
      });
    }
  },
  options: {
    category: "moderation",
  },
};
