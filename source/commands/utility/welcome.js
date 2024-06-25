const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");
const Settings = require("../../models/Settings.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Setup the server welcome system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Set the welcome channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send welcome messages to")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Toggle the welcome system on/off"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("test")
        .setDescription("Test the system to make sure it works properly"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("background")
        .setDescription("Set the background of the welcome card")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The URL of the background image")
            .setRequired(true),
        ),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels,
      )
    ) {
      return await interaction.editReply({
        embeds: [embeds.noPerms],
      });
    }

    if (!interaction.inGuild()) {
      return await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
    }

    const guildId = interaction.guild.id;
    const query = { guildId };

    try {
      const settings = await Settings.findOne(query);

      if (subcommand === "channel") {
        const channel = interaction.options.getChannel("channel");
        settings.welcome.channelId = channel.id;

        await settings.save();

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Channel Updated")
              .setDescription(
                `${interaction.user} has updated the welcome channel to ${channel}.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }

      if (subcommand === "toggle") {
        if (!settings.welcome.channelId) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "No welcome channel was found! Please set one using `/welcome channel`",
                )
                .setColor("Red"),
            ],
          });
        }

        settings.welcome.enabled = !settings.welcome.enabled;
        await settings.save();

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                settings.welcome.enabled
                  ? "Welcome Enabled"
                  : "Welcome Disabled",
              )
              .setDescription(
                `${interaction.user} has ${
                  settings.welcome.enabled ? "enabled" : "disabled"
                } the welcome system.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }

      if (subcommand === "test") {
        if (!settings.welcome.channelId) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "No welcome channel was found! Please set one using `/welcome channel`",
                )
                .setColor("Red"),
            ],
          });
        }

        const channel = interaction.guild.channels.cache.get(
          settings.welcome.channelId,
        );
        if (!channel) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "The specified welcome channel no longer exists!",
                )
                .setColor("Red"),
            ],
          });
        }

        const serverName = encodeURIComponent(interaction.guild.name);
        const welcomeCard = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(
          settings.welcome.cardBackground,
        )}&text1=${encodeURIComponent(
          interaction.user.username,
        )}&text2=Welcome+To+${serverName}&text3=Member+${
          interaction.guild.memberCount
        }&avatar=${encodeURIComponent(
          interaction.user
            .displayAvatarURL({ format: "png", dynamic: true })
            .replace("webp", "png"),
        )}`;

        await channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("New Member")
              .setDescription(`${interaction.user} has joined the server.`)
              .setColor("#4d81dd")
              .setTimestamp()
              .setImage(welcomeCard),
          ],
        });

        return await interaction.editReply("Welcome message sent.");
      }

      if (subcommand === "background") {
        const url = interaction.options.getString("url");

        try {
          new URL(url);
        } catch {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription("The URL you provided is invalid!")
                .setColor("Red"),
            ],
          });
        }

        settings.welcome.cardBackground = url;
        await settings.save();

        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Welcome Background")
              .setDescription(
                `${interaction.user} has updated the welcome background!`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .setImage(url),
          ],
        });
      }
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
      await interaction.editReply({
        embeds: [embeds.error],
      });
    }
  },
  options: {
    category: "utility",
  },
};
