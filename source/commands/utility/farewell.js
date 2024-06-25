const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");
const Settings = require("../../models/Settings.js");
const c = require("chalk");
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("farewell")
    .setDescription("Setup the server farewell system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Set the farewell channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send farewell messages to")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Toggle the farewell system on/off"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("test")
        .setDescription(
          "Test the farewell system to make sure it works properly",
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

    try {
      const query = { guildId: interaction.guild.id };
      let settings = await Settings.findOne(query);

      if (subcommand === "channel") {
        const channel = interaction.options.getChannel("channel");
        const channelId = channel.id;
        const update = {
          $setOnInsert: {
            guildId: interaction.guild.id,
          },
          $set: {
            "farewell.enabled": false,
            "farewell.channelId": channelId,
            "farewell.guildId": interaction.guild.id,
          },
        };
        const options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        };

        settings = await Settings.findOneAndUpdate(query, update, options);

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(settings ? "Channel Updated" : "Channel Set")
              .setDescription(
                `${interaction.user} has ${
                  settings ? "updated" : "set"
                } the farewell channel to ${channel}.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }

      if (subcommand === "toggle") {
        if (!settings || !settings.farewell) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "No farewell channel was found! Please set one using `/farewell channel`",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        const farewellEnabled = !settings.farewell.enabled;
        const updateToggle = {
          $set: {
            "farewell.enabled": farewellEnabled,
          },
        };

        await Settings.findOneAndUpdate(query, updateToggle, {
          new: true,
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                farewellEnabled ? "Farewell Enabled" : "Farewell Disabled",
              )
              .setDescription(
                `${interaction.user} has ${
                  farewellEnabled ? "enabled" : "disabled"
                } the farewell system.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      }

      if (subcommand === "test") {
        if (!settings || !settings.farewell) {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "No farewell channel was found! Please set one using `/farewell channel`",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        const channel = interaction.guild.channels.cache.get(
          settings.farewell.channelId,
        );

        if (!channel) {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "No farewell channel was found! Please set one using `/farewell channel`",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        await channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Member Left")
              .setDescription(`${interaction.user} has left the server.`)
              .setColor("Red")
              .setTimestamp()
              .setFooter({
                text: "We hope to see you again soon!",
              }),
          ],
        });
        await interaction.editReply("Farewell message sent.");
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
