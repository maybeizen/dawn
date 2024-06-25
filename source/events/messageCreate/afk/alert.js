const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const Afk = require("../../../models/Afk.js");

module.exports = async (message) => {
  if (message.author.bot) return;

  try {
    if (message.mentions.users.size > 0) {
      for (const user of message.mentions.users.values()) {
        const afk = await Afk.findOne({ userId: user.id });

        if (afk && afk.userId !== message.author.id) {
          await message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Alert")
                .setDescription(
                  `${user} is currently AFK! Please refrain from pinging them.`,
                )
                .setColor("#4d81dd")
                .setTimestamp()
                .addFields({
                  name: "Reason",
                  value: afk.afkStatus,
                }),
            ],
          });
        }
      }
    }
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
};
