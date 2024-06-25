const { EmbedBuilder } = require("discord.js");
const Welcome = require("../../models/Welcome.js");
const c = require("chalk");

module.exports = async (member) => {
  try {
    const welcome = await Welcome.findOne({
      guildId: member.guild.id,
    });

    if (!welcome || welcome.enabled != true) return;

    const serverName = encodeURIComponent(member.guild.name);
    const cardBackground =
      welcome.cardBackground || `https://i.redd.it/gjhyx3h8k72c1.png`;

    const welcomeCard = `https://api.popcat.xyz/welcomecard?background=${cardBackground}&text1=${
      member.user.username
    }&text2=Welcome+To+${serverName}&text3=Member+${
      member.guild.memberCount
    }&avatar=${member
      .displayAvatarURL({ format: "png", dynamic: true })
      .replace("webp", "png")}`;

    const channel = member.guild.channels.cache.get(welcome.channelId);

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("New Member")
          .setDescription(`${member} has joined ${member.guild.name}.`)
          .setColor("#4d81dd")
          .setTimestamp()
          .setImage(welcomeCard),
      ],
    });
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
};
