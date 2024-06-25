const c = require("chalk");

module.exports = (guild, client) => {
  console.log(
    c.cyan(`${client.user.username} has been added to ${guild.name}`),
  );
};
