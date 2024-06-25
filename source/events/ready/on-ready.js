const { ActivityType } = require("discord.js");
const c = require("chalk");

module.exports = (client) => {
  console.log("\n" + "=".repeat(25) + "\n");
  console.log(c.green(`${client.user.username} is online and ready`));
  console.log("\n" + "=".repeat(25) + "\n");

  client.user.setActivity({
    name: "/help | Dawn",
    type: ActivityType.Watching,
  });
};
