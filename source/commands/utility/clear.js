const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Mass-delete messages from this channel")
    .addIntegerOption((options) =>
      options
        .setName("amount")
        .setDescription("The amount of messages to clear")
        .setRequired(true)
        .setMaxValue(99)
        .setMinValue(1),
    ),

  run: async ({ interaction }) => {
    const amount = interaction.options.getInteger("amount");

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
      const messageCount = await interaction.channel.messages.fetch({
        limit: amount,
      });

      await interaction.channel.bulkDelete(messageCount, true);

      const followUp = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Cleared Messages")
            .setDescription(
              `${interaction.user} has cleared ${amount} from ${interaction.channel}`,
            )
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
      });

      await pause(2000);
      await followUp.delete();
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

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
