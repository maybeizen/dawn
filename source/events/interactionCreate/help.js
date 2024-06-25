const { EmbedBuilder } = require("discord.js");

const values = {
  utility: "Utility",
  moderation: "Moderation",
  economy: "Economy",
  fun: "Fun",
  user: "User",
  "server-data": "Server Data",
};

module.exports = async (interaction, client, handler) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "help-menu") {
    const value = interaction.values[0];

    const commands = handler.commands.filter(
      (command) =>
        command.options &&
        command.options.category &&
        command.options.category === value,
    );

    if (commands.length === 0) {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Commands Found")
            .setDescription(
              `No commands were found in the category **${values[value]}**`,
            )
            .setColor("Red"),
        ],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${values[value]} Help Menu`)
      .setDescription(
        `Here is a list of all commands for the category **${
          values[value]
        }** \n\n${commands
          .map(
            (command) =>
              `- \`/${command.data.name}\` - ${command.data.description}`,
          )
          .join("\n")}`,
      )
      .setColor("#4d81dd")
      .setTimestamp();

    await interaction.update({
      embeds: [embed],
    });
  }
};
