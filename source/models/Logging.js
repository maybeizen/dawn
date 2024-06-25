const { Schema, model } = require("mongoose");

const loggingSchema = new Schema({
  modLogsChannelId: {
    type: String,
    required: false,
  },
  messageLogsChannelId: {
    type: String,
    required: false,
  },

  generalLogsChannelId: {
    type: String,
    required: false,
  },
});

module.exports = model("Logging", loggingSchema);
