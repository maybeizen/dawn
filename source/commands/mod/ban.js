const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from this guild.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Ban a user from this guild")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to ban")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("The reason for banning"),
        ),
    ),
  run: async ({ interaction }) => {
    await interaction.deferReply({});
    const command = interaction.options.getSubcommand();

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      await interaction.editReply({
        embeds: [embeds.noPerms],
      });
      return;
    }

    const bot = interaction.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Ban Members`",
            )
            .setColor("Red"),
        ],
      });
    }

    if (command === "add") {
      const user = interaction.options.getMember("user");
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";
      const targetUserRolePosition = user.roles.highest.position;
      const authorUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position;

      if (!user) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("That user was not found in this server!")
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
                "You are not allowed to ban that user, they are the owner of this server.",
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
                "You am not allowed to ban that user, they have a higher role than you.",
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
                "I am not allowed to ban that user, they have a higher role than me.",
              )
              .setColor("Red"),
          ],
        });

        return;
      }

      try {
        await user.ban({ reason: reason });
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Banned User")
              .setDescription(
                `${interaction.user} has banned ${user} from this server!`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({ name: "Reason", value: reason }),
          ],
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));

        await interaction.editReply({
          embeds: [embeds.error],
        });
      }
    }
  },
  options: {
    category: "moderation",
  },
};
