const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage configurable Dawn settings."),

  run: async ({ interaction }) => {
    await interaction.deferReply();
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
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
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

    const embed = new EmbedBuilder()
      .setTitle("Settings")
      .setDescription(
        `Here is the main area where you can configure some of the settings with Dawn, such as ticket message, welcome messages, etc.

- Press the buttons below to configure the available options.`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    const ticketButton = new ButtonBuilder()
      .setLabel("Tickets")
      .setCustomId("ticket-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const welcomeButton = new ButtonBuilder()
      .setLabel("Welcome")
      .setCustomId("welcome-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const farewellButton = new ButtonBuilder()
      .setLabel("Farewell")
      .setCustomId("farewell-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const autoroleButton = new ButtonBuilder()
      .setLabel("Autorole")
      .setCustomId("autorole-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const suggestionsButton = new ButtonBuilder()
      .setLabel("Suggestions")
      .setCustomId("suggestions-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const staffButton = new ButtonBuilder()
      .setLabel("Staff")
      .setCustomId("staff-settings-button")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      ticketButton,
      welcomeButton,
      farewellButton,
      autoroleButton,
      suggestionsButton,
    );

    const row2 = new ActionRowBuilder().addComponents(staffButton);

    await interaction.editReply({ embeds: [embed], components: [row, row2] });
  },
  options: {
    category: "utility",
  },
};
