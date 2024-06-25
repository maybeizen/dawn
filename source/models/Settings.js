const { Schema, model } = require("mongoose");

const settingsSchema = new Schema({
  guildId: { type: String },
  tickets: { type: Object, default: {} },
  logs: { type: Object, default: {} },
  welcome: { type: Object, default: {} },
  autorole: { type: Object, default: {} },
  farewell: { type: Object, default: {} },
  economy: { type: Object, default: {} },
  suggestion: { type: Object, default: {} },
});

module.exports = model("Settings", settingsSchema);
