const crimes = require("../db/crimes");
const professions = require("../db/professions");

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomCrime() {
  const randomIndex = Math.floor(Math.random() * crimes.length);
  return crimes[randomIndex];
}

function randomProfession() {
  const randomIndex = Math.floor(Math.random() * professions.length);
  return professions[randomIndex];
}

module.exports = {
  randomNumber: randomNumber,
  randomCrime: randomCrime,
  randomProfession: randomProfession,
};
