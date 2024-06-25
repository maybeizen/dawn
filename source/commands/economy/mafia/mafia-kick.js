const Mafia = require("../../../models/Mafia.js");
const { EmbedBuilder } = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
    try {

    } catch (error) {
        console.error(c.red(error));
        console.log(c.gray(error.stack));
    }
}