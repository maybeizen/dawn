const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const c = require("chalk");
const Economy = require("../../models/Economy");
const embeds = require("../../db/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check a users economy balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to check the balance of"),
    ),
  run: async ({ interaction }) => {
    await interaction.deferReply();

    try {
      const user = interaction.options.getUser("user") || interaction.user;
      const member =
        interaction.options.getMember("user") || interaction.member;
      const economy = await Economy.findOne({
        userId: user.id,
      });

      if (user.bot) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("You can't check the balance of a bot!")
              .setColor("Red"),
          ],
        });
        return;
      }

      if (!economy) {
        const economy = new Economy({
          userId: user.id,
          money: 0,
          bank: 0,
        });

        await economy.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${user.username}'s Balance`)
              .setDescription(`Here are the balances of ${user}`)
              .setColor("#4d81dd")
              .setTimestamp()
              .addFields(
                {
                  name: "Money",
                  value: `${economy.money} :coin:`,
                  inline: true,
                },
                {
                  name: "Bank",
                  value: `${economy.bank} :coin:`,
                  inline: true,
                },
              ),
          ],
        });

        return;
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${user.username}'s Balance`)
            .setDescription(`Here are the balances of ${user}`)
            .setColor("#4d81dd")
            .setTimestamp()
            .addFields(
              {
                name: "Money",
                value: `${economy.money} :coin:`,
                inline: true,
              },
              {
                name: "Bank",
                value: `${economy.bank} :coin:`,
                inline: true,
              },
            ),
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
    category: "economy",
  },
};
