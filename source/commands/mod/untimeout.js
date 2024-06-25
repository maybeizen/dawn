const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Unmute a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to untimeout")
        .setRequired(true),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({});

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers,
      )
    ) {
      await interaction.editReply({
        embeds: [embeds.noPerms],
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
              "You are not allowed to un-timeout that user, they are the owner of this server.",
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
              "You are not allowed to un-timeout that user, they are an administrator.",
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
              "You are not allowed to un-timeout that user, they have a higher role than you!.",
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
              "I are not allowed to un-timeout that user, they have a higher role than me!.",
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    try {
      await user.timeout(null);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Unmuted Member`)
            .setDescription(`${interaction.user} has un-timed out by ${user}`)
            .setColor("#4d81dd")
            .setFooter({}),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));

      await interaction.editReply({
        embeds: [embeds.error],
      });
    }
  },
  options: {
    category: "moderation",
  },
};
