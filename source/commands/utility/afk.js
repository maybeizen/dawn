const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const c = require("chalk");
const Afk = require("../../models/Afk.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set yourself as away.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("on")
        .setDescription("Enable afk mode")
        .addStringOption((option) =>
          option
            .setName("status")
            .setDescription("The message users will receive when pinging you."),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("off").setDescription("Disable afk mode"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Set the default status for afk mode")
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("The status to be set as the default")
            .setRequired(true),
        ),
    ),

  run: async ({ interaction }) => {
    const command = interaction.options.getSubcommand();

    try {
      if (command === "on") {
        const customStatus = interaction.options.getString("status");
        const afk = await Afk.findOneAndUpdate(
          { userId: interaction.user.id },
          { isAfk: true, afkStatus: customStatus || "No Reason" },
          { new: true, upsert: true },
        );

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("AFK Enabled")
              .setDescription(
                `Hey ${interaction.user}, you are now in AFK mode. Any message sent after this will automatically disable AFK mode.`,
              )
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({ name: "Reason", value: afk.afkStatus }),
          ],
        });
      } else if (command === "off") {
        const afk = await Afk.findOneAndDelete({ userId: interaction.user.id });

        if (!afk) {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Not in AFK mode")
                .setDescription(
                  `${interaction.user}, you are not in AFK mode. Use \`/afk on\` to enable it.`,
                )
                .setColor("Red"),
            ],
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("AFK Disabled")
              .setDescription(
                `${interaction.user}, you are no longer in AFK mode.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "status") {
        const newStatus = interaction.options.getString("text");
        const afk = await Afk.findOneAndUpdate(
          { userId: interaction.user.id },
          { afkStatus: newStatus },
          { new: true, upsert: true },
        );

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Default AFK Status Updated")
              .setDescription("Your default AFK status has been updated!")
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields({ name: "New Default Status", value: newStatus }),
          ],
        });
      }
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    }
  },
  options: {
    category: "utility",
  },
};
