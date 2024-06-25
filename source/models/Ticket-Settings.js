const { Schema, model } = require("mongoose");

const ticketSettingsSchema = new Schema({
  ticketMessage: {
    type: String,
    required: false,
  },
  ticketPanelMessage: {
    type: String,
    required: false,
  },
  staffRoleId: {
    type: String,
    required: false,
  },
  staffPings: {
    type: Boolean,
    default: false,
  },
  guildId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: false,
  },
});

module.exports = model("TicketSettings", ticketSettingsSchema);
