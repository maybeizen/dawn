const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the guild")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick from this guild")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for kicking"),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No Reason";

    const targetUserRolePosition = user.roles.highest.position;
    const authorUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      await interaction.editReply({
        embeds: [embeds.noPerms],
      });

      return;
    }

    const bot = interaction.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Kick Members`",
            )
            .setColor("Red"),
        ],
      });
    }

    if (!targetUser) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`That user was not found in this server`)
            .setColor("Red"),
        ],
      });
    }

    if (targetUser.id === interaction.guild.ownerId) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `You are not allowed to kick that user, they are the server owner.`,
            )
            .setColor("Red"),
        ],
      });
    }

    if (targetUserRolePosition >= authorUserRolePosition) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `You are not allowed to kick this user, they have a higher role than you.`,
            )
            .setColor("Red"),
        ],
      });
    }

    if (targetUserRolePosition >= botRolePosition) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `I cannot kick this user, they have a higher role than me.`,
            )
            .setColor("Red"),
        ],
      });
    }

    try {
      await targetUser.kick({ reason: reason });
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Kicked User")
            .setDescription(
              `${interaction.user} has kicked ${user} from the server`,
            )
            .setColor("#4d81dd")
            .setTimestamp(),
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
