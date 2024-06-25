const c = require("chalk");

module.exports = (guild, client) => {
  console.log(
    c.cyan(`${client.user.username} has been removed from ${guild.name}`),
  );
};
