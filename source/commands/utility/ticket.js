const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const Settings = require("../../models/Settings.js");
const c = require("chalk");
const { errorEmbed } = require("../../config/_embeds.js");
const { noPerms, runInGuild } = require("../../config/_messages_.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Manage the ticket system")
    .addSubcommand((subcommand) =>
      subcommand.setName("toggle").setDescription("Toggle the ticket system"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("category")
        .setDescription("Change the category tickets are created in")
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("The category to send tickets to")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a user to a ticket")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add to the ticket")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a user from a ticket")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove from the ticket")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription("Send the embed for creating tickets")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the ticket embed to")
            .addChannelTypes(ChannelType.GuildText),
        ),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();

    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(runInGuild)
            .setColor("Red"),
        ],
      });
      return;
    }

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels,
      )
    ) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(noPerms)
            .setColor("Red"),
        ],
      });
      return;
    }

    const bot = interaction.guild.members.cache.get(client.user.id);
    if (!bot.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "I do not have the permissions required to run this command. I am missing permission: `Manage Channels`. Please add this permission or tickets will not work correctly!",
            )
            .setColor("Red"),
        ],
      });
      return;
    }

    try {
      const guildId = interaction.guild.id;
      const userId = interaction.user.id;

      let settings = await Settings.findOne({ guildId });

      if (command === "toggle") {
        settings.ticketSystemEnabled = !settings.ticketSystemEnabled;
        await settings.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                settings.ticketSystemEnabled
                  ? "Ticket System Enabled"
                  : "Ticket System Disabled",
              )
              .setDescription(
                `${interaction.user} has ${
                  settings.ticketSystemEnabled ? "enabled" : "disabled"
                } the ticket system.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "category") {
        const channel = interaction.options.getChannel("category");

        settings.ticketCategory = channel.id;
        await settings.save();

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket Category Set")
              .setDescription(
                `${interaction.user} has set the ticket category to \`${channel.name}\``,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "add") {
        const user = interaction.options.getUser("user");
        if (!interaction.channel.name.startsWith("ticket-")) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "This command can ONLY be used inside of a ticket!\n\n(If this is another ticket bot, this command will **NOT WORK**)",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        await interaction.channel.permissionOverwrites.edit(user.id, {
          ViewChannel: true,
          SendMessages: true,
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("User Added")
              .setDescription(
                `${interaction.user} has added ${user} to this ticket`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "remove") {
        const user = interaction.options.getUser("user");
        if (!interaction.channel.name.startsWith("ticket-")) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "This command can ONLY be used inside of a ticket!\n\n(If this is another ticket bot, this command will **NOT WORK**)",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        await interaction.channel.permissionOverwrites.edit(user.id, {
          ViewChannel: false,
          SendMessages: false,
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("User Removed")
              .setDescription(
                `${interaction.user} has removed ${user} from this ticket`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
        });
      } else if (command === "send") {
        const channel =
          interaction.options.getChannel("channel") || interaction.channel;

        if (!settings.ticketCategory) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "Ticket category not set! Please set a category using `/ticket category` first.",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        const ticketCategory = interaction.guild.channels.cache.get(
          settings.ticketCategory,
        );

        if (!ticketCategory || !ticketCategory.isText()) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error")
                .setDescription(
                  "The ticket category was not found or is not a text channel! Please contact an administrator.",
                )
                .setColor("Red"),
            ],
          });
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle(`Support Tickets | ${interaction.guild.name}`)
          .setDescription(
            "Click the button below to create a new support ticket.",
          )
          .setColor("#4d81dd")
          .setTimestamp();

        const ticketButton = new ButtonBuilder()
          .setLabel("New Ticket")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("new-ticket-button");

        const row = new ActionRowBuilder().addComponents(ticketButton);

        await channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket Embed Sent")
              .setDescription(
                `${interaction.user} has sent the ticket embed to ${channel}`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
      await interaction.editReply({
        embeds: [errorEmbed],
      });
    }
  },
  options: {
    category: "utility",
  },
};
