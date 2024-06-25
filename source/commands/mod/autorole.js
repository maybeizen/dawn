const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { errorEmbed } = require("../../config/_embeds.js");
const embeds = require("../../db/embeds.js");
const Settings = require("../../models/Settings.js");
const c = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Setup autorole for this server")
    .addSubcommand((subcommand) =>
      subcommand.setName("toggle").setDescription("Toggle autorole on/off"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("role")
        .setDescription("Set the role for autorole")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to set as autorole")
            .setRequired(true),
        ),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole("role");

    if (!interaction.inGuild()) {
      return await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
    }

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
    ) {
      return await interaction.editReply({
        embeds: [embeds.noPerms],
      });
    }

    try {
      const guildId = interaction.guild.id;
      const settings = await Settings.findOne({ guildId });

      if (subcommand === "toggle") {
        if (!settings || !settings.autorole.roleId) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  `Before you toggle autorole, use \`/autorole role\` to set the role you want to autorole.`,
                )
                .setColor("Red"),
            ],
          });
        }

        settings.autorole.enabled = !settings.autorole.enabled;
        await settings.save();

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Autorole")
              .setDescription(
                `Autorole is now ${
                  settings.autorole.enabled ? "enabled" : "disabled"
                }`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (subcommand === "role") {
        if (!role) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Please provide a valid role.")
                .setColor("Red"),
            ],
          });
        }

        if (!settings) {
          const newSettings = new Settings({
            guildId,
            autorole: {
              enabled: true,
              roleId: role.id,
            },
          });

          await newSettings.save();

          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Autorole")
                .setDescription(
                  `${interaction.user} has set the autorole role to ${role}`,
                )
                .setColor("#4d81dd")
                .setTimestamp(),
            ],
          });
        }

        settings.autorole.roleId = role.id;
        await settings.save();

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Autorole")
              .setDescription(
                `${interaction.user} has set the autorole role to ${role}`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }
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
