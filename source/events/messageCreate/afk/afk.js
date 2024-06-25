const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const Afk = require("../../../models/Afk.js");

module.exports = async (message) => {
  try {
    const afk = await Afk.findOne({
      userId: message.author.id,
    });

    if (!afk) return;

    if (afk.isAfk) {
      afk.isAfk = false;
      await afk.save();

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("AFK Disabled")
            .setDescription(`${message.author}, you are no longer in AFK mode.`)
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
      });
    }
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
};
