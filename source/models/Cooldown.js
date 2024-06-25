const { Schema, model } = require("mongoose");

const cooldownSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = model("Cooldown", cooldownSchema);
