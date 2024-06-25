const { SlashCommandBuilder } = require("discord.js");
const c = require("chalk");
const mafiaAccept = require("./mafia/mafia-accept.js");
const mafiaCreate = require("./mafia/mafia-create.js");
const mafiaDeposit = require("./mafia/mafia-deposit.js");
const mafiaDissolve = require("./mafia/mafia-dissolve.js");
const mafiaInfo = require("./mafia/mafia-info.js");
const mafiaInvite = require("./mafia/mafia-invite.js");
const mafiaKick = require("./mafia/mafia-kick.js");
const mafiaLeave = require("./mafia/mafia-leave.js");
const mafiaMotto = require("./mafia/mafia-motto.js");
const mafiaPromote = require("./mafia/mafia-promote.js");
const mafiaRank = require("./mafia/mafia-rank.js");
const mafiaRename = require("./mafia/mafia-rename.js");
const mafiaWithdraw = require("./mafia/mafia-withdraw.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mafia")
    .setDescription("Create and manage a crime syndicate.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new mafia. Requires 5000 coins.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the mafia.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rename")
        .setDescription("Rename your mafia. Costs 1000 coins")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The new name to give your mafia.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("invite")
        .setDescription("Invite a member to your mafia.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to invite.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a member from your mafia.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The member to kick")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("promote")
        .setDescription("Promote a member to a higher rank")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The member to promote")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank")
        .setDescription("Get the rank of a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The member to get the rank of")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("motto")
        .setDescription("Set your mafias motto")
        .addStringOption((option) =>
          option
            .setName("motto")
            .setDescription("The motto to set")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deposit")
        .setDescription("Deposit coins to your mafias bank")
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of coins to deposit")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("withdraw")
        .setDescription(
          "Withdraw coins from your mafias bank. Only godfathers and underbosses can do this.",
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of coins to withdraw")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("dissolve").setDescription("Disband your mafia."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("delete").setDescription("Delete your mafia."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("info").setDescription("Get info about your mafia."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("accept")
        .setDescription("Accept an invitation to a mafia."),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("leave").setDescription("Leave your mafia."),
    ),

  run: async ({ interaction }) => {
    try {
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "accept":
          mafiaAccept(interaction);
          break;

        case "create":
          mafiaCreate(interaction);
          break;

        case "deposit":
          mafiaDeposit(interaction);
          break;

        case "dissolve":
          mafiaDissolve(interaction);
          break;

        case "info":
          mafiaInfo(interaction);
          break;

        case "invite":
          mafiaInvite(interaction);
          break;

        case "kick":
          mafiaKick(interaction);
          break;

        case "leave":
          mafiaLeave(interaction);
          break;

        case "motto":
          mafiaMotto(interaction);
          break;

        case "promote":
          mafiaPromote(interaction);
          break;

        case "rank":
          mafiaRank(interaction);
          break;

        case "rename":
          mafiaRename(interaction);
          break;

        case "withdraw":
          mafiaWithdraw(interaction);
          break;
      }
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    }
  },
};
