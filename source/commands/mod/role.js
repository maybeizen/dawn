const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage roles for a user.")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a role to a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add the role to.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the user.")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a role from a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove the role from.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove from the user.")
            .setRequired(true),
        ),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();
    const user = await interaction.guild.members.fetch(
      interaction.options.getUser("user"),
    );
    const role = interaction.options.getRole("role");
    const author = interaction.member;
    const highestRole = author.roles.highest;

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
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
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
    if (!bot.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Manage Roles`",
            )
            .setColor("Red"),
        ],
      });
    }

    if (command === "add") {
      if (user.roles.cache.has(role.id)) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`${user} already has the role ${role}`)
              .setColor("Red"),
          ],
        });
      }

      if (role.comparePositionTo(highestRole) >= 0) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "You are not allowed to add roles that are higher than your highest role.",
              )
              .setColor("Red"),
          ],
        });
      }

      try {
        await user.roles.add(role);

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Role Added")
              .setDescription(`${user} has been given the role ${role}`)
              .setColor("4d81dd")
              .setTimestamp(),
          ],
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));

        return await interaction.editReply({
          embeds: [errorEmbed],
        });
      }
    } else if (command === "remove") {
      if (!user.roles.cache.has(role.id)) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(`${user} does not have the role ${role}`)
              .setColor("Red"),
          ],
        });
      }

      if (role.comparePositionTo(highestRole) >= 0) {
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "You are not allowed to remove roles that are higher than your highest role.",
              )
              .setColor("Red"),
          ],
        });
      }

      try {
        await user.roles.remove(role);

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Role Taken")
              .setDescription(`${user} has been removed from the role ${role}`)
              .setColor("4d81dd")
              .setTimestamp(),
          ],
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.red(error.stack));

        return await interaction.editReply({
          embeds: [errorEmbed],
        });
      }
    }
  },
  options: {
    category: "moderation",
  },
};
