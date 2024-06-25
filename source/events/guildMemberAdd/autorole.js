const c = require("chalk");
const Autorole = require("../../models/Autorole.js");

module.exports = async (member) => {
  try {
    const autorole = await Autorole.findOne({
      guildId: member.guild.id,
    });

    if (!autorole || autorole.enabled != true || member.user.bot) return;

    const role = member.guild.roles.cache.get(autorole.roleId);
    await member.roles.add(role);
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error.stack));
  }
};
