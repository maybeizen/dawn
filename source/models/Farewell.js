const { Schema, model } = require("mongoose");

const farewellSchema = new Schema({
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

module.exports = model("Farewell", farewellSchema);
