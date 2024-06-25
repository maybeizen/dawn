const { Schema, model } = require("mongoose");

const welcomeSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  channelId: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
  cardBackground: {
    type: String,
    required: false,
  },
});

module.exports = model("Welcome", welcomeSchema);
