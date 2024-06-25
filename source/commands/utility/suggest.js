const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Settings = require("../../models/Settings.js");
const Cooldown = require("../../models/Cooldown.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest something for the server")
    .addStringOption((options) =>
      options
        .setName("suggestion")
        .setDescription("The suggestion to make")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(1000),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
      return;
    }

    try {
      const guildId = interaction.guild.id;
      const settings = await Settings.findOne({ guildId });

      if (!settings) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("No suggestion settings found for this server!")
              .setColor("Red"),
          ],
        });
        return;
      }

      if (!settings.suggestionEnabled) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "The suggestion system is disabled in this server!",
              )
              .setColor("Red"),
          ],
        });
        return;
      }

      const suggestionChannel = interaction.guild.channels.cache.get(
        settings.suggestionChannelId,
      );

      if (!suggestionChannel || !suggestionChannel.isText()) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "The suggestion channel was not found or is not a text channel! Please contact an administrator.",
              )
              .setColor("Red"),
          ],
        });
        return;
      }

      const cooldown = await Cooldown.findOne({
        userId: interaction.user.id,
        type: "suggestion",
      });

      const now = Date.now();
      const cooldownAmount = 10 * 60 * 1000; // 10 minutes cooldown

      if (cooldown) {
        const expirationTime = cooldown.timestamp.getTime() + cooldownAmount;

        if (now < expirationTime) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooldown")
                .setDescription(
                  `You can submit another suggestion <t:${Math.floor(
                    expirationTime / 1000,
                  )}:R>.`,
                )
                .setColor("Red"),
            ],
          });
          return;
        }
      }

      await Cooldown.findOneAndUpdate(
        { userId: interaction.user.id, type: "suggestion" },
        { timestamp: new Date(now) },
        { upsert: true, new: true },
      );

      const suggestionMessage = await suggestionChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Suggestion")
            .setDescription(interaction.options.getString("suggestion"))
            .setColor("#4d81dd")
            .setTimestamp()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
              text: "✅ > Like It || ❌ > Don't Like It",
            }),
        ],
      });

      suggestionMessage.react("✅");
      suggestionMessage.react("❌");

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Suggestion Submitted")
            .setDescription(
              `Your suggestion has been submitted to ${interaction.guild.name}`,
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
    category: "utility",
  },
};
