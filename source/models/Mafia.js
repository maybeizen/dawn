const { Schema, model } = require("mongoose");

const mafiaSchema = new Schema({
  owner: { type: String, required: true }, // Mafia Owner Id
  name: { type: String }, // Mafia Name
  motto: { type: String }, // Mafia Motto
  cutPercentage: { type: Number, default: 80 }, // The amount of money, from each members crimes, that is taken by the Mafia
  bank: { type: Number, default: 1000 }, // The Mafia's Bank. Stores the amount of money that the Mafia has. If it reaches 0, the Mafia is disbanded
  members: { type: Array, default: [] }, // The members of the Mafia
  pendingInvites: { type: Array, default: [] }, // Pending invites to users for the Mafia
});

module.exports = model("Mafia", mafiaSchema);
