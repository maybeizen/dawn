const { Schema, model } = require("mongoose");

const economySchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Economy", economySchema);
