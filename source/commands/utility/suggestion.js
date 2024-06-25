const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const Settings = require("../../models/Settings.js");
const c = require("chalk");
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("Manage the server-wide suggestion system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Change the suggestion channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("What to change the channel to.")
            .setRequired(true)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Toggle the suggestion system on/off"),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();

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

    const guildId = interaction.guild.id;
    const query = { guildId };

    try {
      let settings = await Settings.findOne(query);

      if (subcommand === "channel") {
        const channel = interaction.options.getChannel("channel");

        settings.suggestion.channelId = channel.id;
        settings.markModified("suggestion");

        await settings.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Channel Updated")
              .setDescription(
                `The suggestion channel has been set to ${channel}`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }

      if (subcommand === "toggle") {
        settings.suggestion.enabled = !settings.suggestion.enabled;
        settings.markModified("suggestion");

        await settings.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                settings.suggestion.enabled
                  ? "Suggestion Enabled"
                  : "Suggestion Disabled",
              )
              .setDescription(
                `${interaction.user} has ${
                  settings.suggestion.enabled ? "enabled" : "disabled"
                } the suggestion system.`,
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
    category: "utility",
  },
};
