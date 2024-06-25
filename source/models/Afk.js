const { Schema, model } = require("mongoose");

const afkSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  isAfk: {
    type: Boolean,
    default: false,
  },
  afkStatus: {
    type: String,
    required: false,
  },
});

module.exports = model("Afk", afkSchema);
