const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const package = require("../../../package.json");
const os = require("node-os-utils");
const process = require("process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Retrieve various information about users, the server, or the bot itself.",
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Get detailed information about a specific user.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("The member to get information about.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Get detailed information about the current server."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot")
        .setDescription("Get detailed information about the bot."),
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "user") {
      const user = interaction.options.getMember("member");

      if (!user) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error")
              .setDescription(
                "The specified user was not found in this server.",
              )
              .setColor("Red"),
          ],
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`User Information: ${user.user.username}`)
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor("#4d81dd")
        .addFields(
          { name: "Username", value: user.user.username, inline: true },
          { name: "User ID", value: `\`${user.user.id}\``, inline: true },
          {
            name: "Display Name",
            value: user.displayName || "N/A",
            inline: true,
          },
          {
            name: "Joined Server",
            value: user.joinedAt ? user.joinedAt.toLocaleString() : "N/A",
            inline: true,
          },
          {
            name: "Account Created",
            value: user.user.createdAt.toLocaleString(),
            inline: true,
          },
          {
            name: "Highest Role",
            value: user.roles.highest ? `<@&${user.roles.highest.id}>` : "N/A",
            inline: true,
          },
          {
            name: "Is Admin?",
            value: user.permissions.has(PermissionsBitField.Flags.Administrator)
              ? "Yes"
              : "No",
            inline: true,
          },
        );

      await interaction.editReply({ embeds: [embed] });
    } else if (subcommand === "server") {
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

      const guild = interaction.guild;
      const iconURL = guild.iconURL({ dynamic: true, size: 1024 });
      const embed = new EmbedBuilder()
        .setTitle(`Server Information: ${guild.name}`)
        .setDescription(`Details about the server: ${guild.name}`)
        .setColor("#4d81dd")
        .setThumbnail(iconURL)
        .setTimestamp()
        .addFields(
          { name: "Server Name", value: guild.name, inline: true },
          { name: "Server ID", value: `\`${guild.id}\``, inline: true },
          { name: "Member Count", value: `${guild.memberCount}`, inline: true },
          {
            name: "Verification Level",
            value: `${guild.verificationLevel}`,
            inline: true,
          },
          {
            name: "Created On",
            value: guild.createdAt.toLocaleDateString("en-US"),
            inline: true,
          },
          { name: "Server Owner", value: `<@${guild.ownerId}>`, inline: true },
          {
            name: "Total Channels",
            value: `${guild.channels.cache.size}`,
            inline: true,
          },
          {
            name: "Total Roles",
            value: `${guild.roles.cache.size}`,
            inline: true,
          },
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("view-roles-button")
          .setLabel("View Roles")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("view-channels-button")
          .setLabel("View Channels")
          .setStyle(ButtonStyle.Secondary),
      );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } else if (subcommand === "bot") {
      const uptime = client.uptime;
      const uptimeHours = Math.floor(uptime / 3600000);
      const uptimeMinutes = Math.floor((uptime % 3600000) / 60000);
      const uptimeSeconds = Math.floor((uptime % 60000) / 1000);
      const uptimeString = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;
      const cpuUsage = await os.cpu.usage();
      const memInfo = await os.mem.info();
      const totalMemoryGB = (memInfo.totalMemMb / 1024).toFixed(2);
      const usedMemoryBytes = process.memoryUsage().heapUsed;
      const usedMemoryGB = (usedMemoryBytes / 1024 / 1024 / 1024).toFixed(2);
      const libraryVersion = package.dependencies["discord.js"].replace(
        "^",
        "",
      );

      const embed = new EmbedBuilder()
        .setTitle(`Info about ${client.user.username}`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor("#4d81dd")
        .addFields(
          { name: "Bot Username", value: client.user.username, inline: true },
          { name: "Bot ID", value: `\`${client.user.id}\``, inline: true },
          {
            name: "Created On",
            value: client.user.createdAt.toLocaleDateString("en-US"),
            inline: true,
          },
          { name: "Uptime", value: uptimeString, inline: true },
          {
            name: "Servers",
            value: `${client.guilds.cache.size}`,
            inline: true,
          },
          {
            name: "Total Users",
            value: `${client.users.cache.size}`,
            inline: true,
          },
          { name: "Bot Version", value: `1.0.0`, inline: true },
          {
            name: "Library",
            value: `Discord.js v${libraryVersion}`,
            inline: true,
          },
          {
            name: "Memory Usage (Bot)",
            value: `${usedMemoryGB} GB / ${totalMemoryGB} GB`,
            inline: true,
          },
          {
            name: "CPU Usage (Bot)",
            value: `${cpuUsage.toFixed(2)}%`,
            inline: true,
          },
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
  options: {
    category: "utility",
  },
};
