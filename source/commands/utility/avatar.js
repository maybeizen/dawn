const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionWebhook,
} = require("discord.js");
const c = require("chalk");
const { errorEmbed } = require("../../config/_embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Fetch a user/server avatar from Discord")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Fetch a user avatar")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The users avatar to get")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("size")
            .setDescription("The size of the avatar, in pixels.")
            .addChoices(
              {
                name: "32 x 32 Pixels",
                value: "32",
              },
              {
                name: "64 x 64 Pixels",
                value: "64",
              },
              {
                name: "128 x 128 Pixels",
                value: "128",
              },
              {
                name: "256 x 256 Pixels",
                value: "256",
              },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Fetch a server icon")
        .addStringOption((option) =>
          option
            .setName("size")
            .setDescription("The size of the avatar, in pixels.")
            .addChoices(
              {
                name: "32 x 32 Pixels",
                value: "32",
              },
              {
                name: "64 x 64 Pixels",
                value: "64",
              },
              {
                name: "128 x 128 Pixels",
                value: "128",
              },
              {
                name: "256 x 256 Pixels",
                value: "256",
              },
            ),
        ),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();

    if (command === "user") {
      try {
        const user = interaction.options.getUser("user");
        const size = interaction.options.getString("size") || "128";
        const avatar = user.avatarURL({ format: "svg", size: Number(size) });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${user.username}'s Avatar`)
              .setDescription(`Here is ${user}'s avatar. (${size} Pixels)`)
              .setImage(avatar)
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
        return;
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
        await interaction.editReply({
          embeds: [errorEmbed],
        });
      }
    } else if (command === "server") {
      try {
        const size = interaction.options.getString("size") || "128";
        const serverIcon = interaction.guild.iconURL({
          format: "png",
          size: Number(size),
        });

        if (!serverIcon) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription("This server does not have an icon!")
                .setColor("Red"),
            ],
          });
          return;
        }

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${interaction.guild.name} Icon`)
              .setDescription(
                `Here is the icon for **${interaction.guild.name}** (${size} Pixels)`,
              )
              .setColor("#4d81dd")
              .setImage(serverIcon)
              .setTimestamp(),
          ],
        });
      } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
        await interaction.editReply({
          embeds: [errorEmbed],
        });
      }
    }
  },
  options: {
    category: "utility",
  },
};
