const Mafia = require("../../../models/Mafia.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const c = require("chalk");
const embeds = require("../../../db/embeds.js");

module.exports = async (interaction) => {
  try {
    const user = interaction.user;
    const allMafias = await Mafia.find();
    const now = new Date();

    const userInvites = await allMafias.reduce(
      async (invitesPromise, mafia) => {
        const invites = await invitesPromise;

        mafia.pendingInvites = mafia.pendingInvites.filter(
          (invite) => new Date(invite.expiresIn) > now,
        );

        const pendingInvite = mafia.pendingInvites.find(
          (invite) => invite.user === user.id,
        );

        if (pendingInvite) {
          const inviterUser = await interaction.client.users.fetch(
            pendingInvite.inviter,
          );

          invites.push({
            label: mafia.name,
            description: `Invited by ${inviterUser.username}`,
            value: mafia._id.toString(),
          });
        }

        if (mafia.isModified()) {
          await mafia.save();
        }

        return invites;
      },
      Promise.resolve([]),
    );

    if (userInvites.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Invites")
            .setDescription("You have no pending invites to any mafias.")
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
      });
      return;
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-mafia-invite")
      .setPlaceholder("Select a mafia to join")
      .addOptions(userInvites);

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    const reply = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Pending Invites")
          .setDescription(
            "Please select a mafia to join from the dropdown below.",
          )
          .setColor("#4d81dd")
          .setTimestamp(),
      ],
      components: [actionRow],
      ephemeral: true,
    });

    const filter = (i) =>
      i.user.id === user.id && i.customId === "select-mafia-invite";

    const collector = reply.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 30000,
    });

    collector.on("collect", async (collected) => {
      const selectedMafiaId = collected.values[0];
      const selectedMafia = await Mafia.findById(selectedMafiaId);

      if (!selectedMafia) {
        await collected.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription("The selected mafia does not exist.")
              .setColor("Red"),
          ],
        });
        return;
      }

      selectedMafia.members.push({
        name: user.username,
        id: user.id,
        standing: "Associate",
        crimes: [],
      });

      selectedMafia.pendingInvites = selectedMafia.pendingInvites.filter(
        (invite) => invite.user !== user.id,
      );

      await selectedMafia.save();

      await collected.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("Mafia Joined")
            .setDescription(`You have joined the ${selectedMafia.name} mafia.`)
            .setColor("#4d81dd")
            .setTimestamp(),
        ],
        components: [],
        ephemeral: true,
      });
    });

    collector.stop();
  } catch (error) {
    console.error(c.red(error));
    console.error(c.gray(error.stack));

    await interaction.reply({
      embeds: [embeds.error],
    });
  }
};
