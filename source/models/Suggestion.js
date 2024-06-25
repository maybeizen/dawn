const { Schema, model } = require("mongoose");

const suggestionSchema = new Schema({
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
});

module.exports = model("Suggestion", suggestionSchema);
