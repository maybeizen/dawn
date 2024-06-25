const { Schema, model } = require("mongoose");

const autoroleSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  roleId: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
});

module.exports = model("Autorole", autoroleSchema);
