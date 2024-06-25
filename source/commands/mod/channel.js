const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Manage a channel for this guild.")
    .addSubcommand((command) =>
      command
        .setName("lock")
        .setDescription("Lock the current/supplied channel.")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("The channel to lock."),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("unlock")
        .setDescription("Unlock the current/supplied channel.")
        .addChannelOption((option) =>
          option.setName("channel").setDescription("The channel to unlock."),
        ),
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel");
    const command = interaction.options.getSubcommand();

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [embeds.runInGuild],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels,
      )
    ) {
      await interaction.editReply({
        embeds: [embeds.noPerms],
      });

      return;
    }

    const bot = interaction.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Manage Channels`",
            )
            .setColor("Red"),
        ],
      });
    }

    if (command === "lock") {
      try {
        if (!channel) {
          await interaction.channel.permissionOverwrites.edit(
            interaction.guild.id,
            {
              SendMessages: false,
            },
          );
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Locked")
                .setDescription(
                  `${interaction.user} has locked channel ${interaction.channel}`,
                )
                .setColor("#4d81dd")
                .setTimestamp(),
            ],
          });
        } else {
          await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: false,
          });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Locked")
                .setDescription(
                  `${interaction.user} has locked channel ${channel}`,
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
    } else if (command === "unlock") {
      try {
        if (!channel) {
          await interaction.channel.permissionOverwrites.edit(
            interaction.guild.id,
            {
              SendMessages: true,
            },
          );
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Unlocked")
                .setDescription(
                  `${interaction.user} has unlocked channel ${interaction.channel}`,
                )
                .setColor("#4d81dd")
                .setTimestamp(),
            ],
          });
        } else {
          await channel.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: true,
          });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Channel Unlocked")
                .setDescription(
                  `${interaction.user} has unlocked channel ${channel}`,
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
          embeds: [embeds.error],
        });
      }
    }
  },
  options: {
    category: "moderation",
  },
};
