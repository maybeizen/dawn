const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const c = require("chalk");
const Ticket = require("../../../models/Ticket.js");
const TicketSettings = require("../../../models/Ticket-Settings.js");

module.exports = async (interaction) => {
  if (!interaction.isButton) {
    return;
  }

  if (interaction.customId === "new-ticket-button") {
    const guild = interaction.guild;

    try {
      const ticketSettings = await TicketSettings.findOne({
        guildId: guild.id,
      });

      const ticket = await Ticket.findOne({
        userId: interaction.user.id,
      });

      if (ticket) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Support Tickets | ${interaction.guild.name}`)
              .setDescription(
                `You already have a ticket open at <#${ticket.channelId}>. Press the button below to jump to your ticket.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Jump")
                .setStyle(ButtonStyle.Link)
                .setURL(
                  `https://discord.com/channels/${guild.id}/${ticket.channelId}`,
                ),
            ),
          ],
          ephemeral: true,
        });

        return;
      }

      const category = await guild.channels.fetch(ticketSettings.categoryId);

      const ticketChannel = await guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: category,
      });

      const newTicket = new Ticket({
        userId: interaction.user.id,
        channelId: ticketChannel.id,
        guildId: guild.id,
      });

      await newTicket.save();

      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Support Tickets | ${interaction.guild.name}`)
              .setDescription(
                `Your ticket has been created. Press the button below to jump to your ticket.`,
              )
              .setColor("#4d81dd")
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Jump")
                .setStyle(ButtonStyle.Link)
                .setURL(
                  `https://discord.com/channels/${guild.id}/${ticketChannel.id}`,
                ),
            ),
          ],
          ephemeral: true,
        })

        .catch((error) => {
          console.error(c.red(error));
          console.log(c.gray(error.stack));
        });

      const rawMessage = ticketSettings.ticketMessage;
      const message = String(rawMessage)
        .replace("[USER]", interaction.user)
        .replace(`[SERVER]`, guild.name)
        .replace(`[TICKET]`, ticketChannel)
        .replace(`[ID]`, ticketChannel.id);

      await ticketChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Support Tickets | ${interaction.guild.name}`)
            .setDescription(message)
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Close")
              .setCustomId("close-ticket-button")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setLabel("Request Staff")
              .setCustomId("request-staff-button")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(!ticketSettings.staffPings),
          ),
        ],
      });
    } catch (error) {
      console.error(c.red(error));
      console.log(c.gray(error.stack));
    }
  }
};
