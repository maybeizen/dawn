const defaults = {
  tickets: {
    name: "Tickets",
    defaults: {
      ticketMessage:
        "Hey [USER] and welcome to your ticket.  Please provide us with as many details for your issue as possible so we can better assist you. If you do not provide sufficient information, your ticket may be closed without reason.",
      ticketPanelMessage:
        "Press the button below to open a ticket. You will be prompted to a private channel where you can speak with the staff of this server. **Empty Tickets will be ignored and closed.**",
      pingRoleId: "",
      pings: false,
      guildId: "{guildID}",
      categoryId: "",
    },
  },
  autorole: {
    name: "Autorole",
    defaults: {
      enabled: false,
      roleId: "",
      guildId: "{guildID}",
    },
  },
  farewell: {
    name: "Farewell",
    defaults: {
      enabled: false,
      channelId: "",
      guildId: "{guildID}",
    },
  },
  welcome: {
    name: "Welcome",
    defaults: {
      enabled: false,
      channelId: "",
      guildId: "{guildID}",
      cardBackground: "https://i.redd.it/gjhyx3h8k72c1.png",
    },
  },
  economy: {
    name: "Economy",
    defaults: {
      enabled: false,
      currencyIcon: "💵",
      guildId: "{guildID}",
    },
  },
  suggestion: {
    name: "Suggestion",
    defaults: {
      enabled: false,
      channelId: "",
      guildId: "{guildID}",
    },
  },
};

module.exports = defaults;
