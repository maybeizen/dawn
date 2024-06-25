require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { CommandKit } = require("commandkit");
const c = require("chalk");
const serviceHandler = require(`./events/ready/services`);
const token = process.env.token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

const kit = new CommandKit({
  client,
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
  skipBuiltInValidations: true,
  bulkRegister: true,
  devUserIds: ["924513291806580736", "1145004702724005969"],
});

client.on("uncaughtException", (error) => {
  console.log("\n" + "=".repeat(25) + "\n");
  console.error(c.red(error));
  console.log(c.gray(error.stack));
  console.log("\n" + "=".repeat(25) + "\n");
});

client.on("unhandledException", (error) => {
  console.log("\n" + "=".repeat(25) + "\n");
  console.error(c.red(error));
  console.log(c.gray(error.stack));
  console.log("\n" + "=".repeat(25) + "\n");
});

(async () => {
  try {
    serviceHandler(client);

    await client.login(token);
  } catch (error) {
    console.error(c.red(error));
    console.log(c.gray(error));
  }
})();
